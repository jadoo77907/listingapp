interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <a
          key={pageNum}
          href={`?page=${pageNum}`}
          className={`mx-1 px-3 py-2 rounded transition duration-150 ease-in-out ${
            pageNum === currentPage
              ? 'bg-primary dark:bg-primary-dark text-white'
              : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {pageNum}
        </a>
      ))}
    </div>
  )
}

