export const RESULTS_PER_PAGE = 20

export function getPageCount(resultCount, pageSize = RESULTS_PER_PAGE) {
  return Math.ceil(resultCount / pageSize)
}

export function getPageResults(results, currentPage, pageSize = RESULTS_PER_PAGE) {
  const startIndex = (currentPage - 1) * pageSize
  return results.slice(startIndex, startIndex + pageSize)
}

export function paginationReducer(currentPage, action) {
  if (action.type === 'criteriaChanged' || action.type === 'sortChanged') return 1

  const lastPage = Math.max(1, action.pageCount)

  if (action.type === 'previous') return Math.max(1, currentPage - 1)
  if (action.type === 'next') return Math.min(lastPage, currentPage + 1)
  if (action.type === 'goTo') {
    return Math.min(lastPage, Math.max(1, action.page))
  }

  return currentPage
}

export function getVisiblePages(currentPage, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis-end', pageCount]
  if (currentPage >= pageCount - 3) {
    return [
      1,
      'ellipsis-start',
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ]
  }

  return [
    1,
    'ellipsis-start',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-end',
    pageCount,
  ]
}
