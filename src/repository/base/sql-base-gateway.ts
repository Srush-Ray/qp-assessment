import { Inject, Logger } from '@nestjs/common';
import * as MYSQL from 'mysql2/promise';
import * as sqlstring from 'sqlstring';
import { PaginatedResult } from 'src/common/dto/response.dto';
import { TableNames } from 'src/constants/enums/TableNames';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export default class SqlCrudEntityGateway {
  private readonly logger;
  mysql: MYSQL.Pool;
  constructor(@Inject('MYSQL_CONNECTION') mysql: MYSQL.Pool) {
    this.mysql = mysql;
    this.logger = new Logger('SQL');
  }
  async runQuery<P>(query: string, params?: unknown | unknown[]): Promise<P[]> {
    return await this.queryWithLogging<P>(this.mysql, query, params);
  }

  getLogMessage(query: string, params?: unknown | unknown[]) {
    return sqlstring.format(query, params);
  }

  async queryWithLogging<P>(
    source: MYSQL.Pool,
    query: string,
    params?: unknown | unknown[],
  ): Promise<P[]> {
    const message = this.getLogMessage(query, params);
    try {
      const queryPromise = (await source.query(
        query,
        params,
      )) as unknown as P[][];
      // message without unnecessary spaces and newlines
      this.logger.log(message);

      return queryPromise[0];
    } catch (err) {
      this.logger.error(message, err);
      throw err;
    }
  }

  async paginationSelect<P>(
    {
      query,
      limit,
      page,
      max_group_concat_length = 10000000,
      max_sort_buffer_size,
    }: {
      query: string;
      limit: number;
      page: number;
      max_group_concat_length?: number;
      max_sort_buffer_size?: number;
    },
    params?: any,
  ): Promise<PaginatedResult<P>> {
    page = parseInt(page as unknown as string) || 1;
    limit = parseInt(limit as unknown as string) || 5;
    const result = await this.runQuery<P>(
      `SET group_concat_max_len=${max_group_concat_length};
        ${max_sort_buffer_size ? `SET sort_buffer_size=${max_sort_buffer_size};` : ''}
       SELECT *, Count(*) Over () AS _count FROM ${query}
       LIMIT ${(page - 1) * limit},${limit}
      `,
      params,
    );
    const count: number =
      max_group_concat_length && max_sort_buffer_size
        ? result[2][0]?._count
        : max_group_concat_length || max_sort_buffer_size
          ? result[1][0]?._count
          : (result[0] as any)?._count;
    const total_pages = Math.ceil(count / limit) || 0;
    const has_prev_page = page > 1;
    const has_next_page = page < total_pages;
    const prev_page = has_prev_page ? page - 1 : null;
    const next_page = has_next_page ? page + 1 : null;
    const metadata = {
      count: count || 0,
      limit: parseInt(limit as unknown as string),
      page: parseInt(page as unknown as string),
      total_pages,
      has_next_page,
      has_prev_page,
      next_page,
      prev_page,
    };
    return {
      result:
        max_group_concat_length && max_sort_buffer_size
          ? (result[2] as unknown as P[])
          : max_group_concat_length || max_sort_buffer_size
            ? (result[1] as unknown as P[])
            : result,
      metadata,
    };
  }

  async insertOneWithId<P>(
    tableName: TableNames,
    params: P,
    generateUuidV4 = true,
    returnId = false,
    connection: MYSQL.PoolConnection | MYSQL.Pool = this.mysql,
  ): Promise<P> {
    const clonedParams = cloneDeep(params);
    Object.keys(clonedParams).forEach((k) =>
      typeof clonedParams[k] == 'object' && clonedParams[k] !== null
        ? (clonedParams[k] = JSON.stringify(clonedParams[k]))
        : typeof clonedParams[k] == 'undefined'
          ? delete clonedParams[k]
          : '',
    );
    if (generateUuidV4) {
      const uuid = uuidv4().replace(/\-/g, '');
      params['ID'] = uuid;
      clonedParams['ID'] = uuid;
    }
    return this.insert<P>(tableName, clonedParams, returnId, connection);
  }

  async insert<P>(
    tableName: TableNames,
    params: P,
    returnId = false,
    connection: MYSQL.PoolConnection | MYSQL.Pool = this.mysql,
  ): Promise<P> {
    try {
      const insertQuery = `INSERT INTO ${tableName} SET ?`;
      this.logger.log(
        sqlstring.format(insertQuery, params as Record<string, unknown>),
      );
      const insertedResult = await connection.query(insertQuery, params);
      if (returnId) {
        const id = (insertedResult[0] as any).insertId;
        params['ID'] = id;
      }
      return params;
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        throw new Error(err.message);
      }
      throw new Error(err);
    }
  }

  async deleteWithId(
    tableName: string,
    params: string,
    connection: MYSQL.PoolConnection | MYSQL.Pool = this.mysql,
  ) {
    const deleteQuery = `DELETE FROM ${tableName} WHERE ?;`;
    this.logger.log(sqlstring.format(deleteQuery, params));
    const deletedResult = await connection.query(deleteQuery, params);
    return deletedResult;
  }

  async updateWithId<P>(
    tableName: string,
    params: P,
    id: string,
    connection: MYSQL.PoolConnection | MYSQL.Pool = this.mysql,
  ) {
    const clonedParams = cloneDeep(params);
    Object.keys(clonedParams).forEach((k) =>
      typeof clonedParams[k] == 'object' && clonedParams[k] !== null
        ? (clonedParams[k] = JSON.stringify(clonedParams[k]))
        : typeof clonedParams[k] == 'undefined'
          ? delete clonedParams[k]
          : '',
    );
    const updateQuery = `UPDATE ${tableName} SET ? WHERE ${sqlstring.escape(id)};`;
    this.logger.log(sqlstring.format(updateQuery, clonedParams));
    const updateResult = await connection.query(updateQuery, clonedParams);
    return updateResult;
  }
}
