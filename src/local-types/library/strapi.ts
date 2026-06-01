export interface IStrapiRelation<T> {
  data: T | null;
}

export interface IStrapiRelationList<T> {
  data: T[];
}

export interface IStrapiSingleResponse<T> {
  data: T;
}

export interface IStrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
