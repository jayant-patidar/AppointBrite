/**
 * Pagination helper.
 */
export function getPagination(page: number = 1, limit: number = 20) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;

  return { skip, limit: safeLimit, page: safePage };
}

export function buildPaginationMeta(totalItems: number, page: number, limit: number) {
  return {
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    limit,
  };
}
