'use client';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import './pagination.css';
import clsx from 'clsx';
export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <nav className="m-4 flex w-1/2 border-t border-gray-300">
      <Link
        href={`/?postlist=${currentPage - 1}`}
        className="h-5 w-5 text-center"
        onClick={e => {
          if (currentPage == 1) e.preventDefault();
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (pageNum, index) => (
          <Link
            className={clsx('pagination-item', {
              'pagination-item-active': pageNum === currentPage,
            })}
            key={index}
            href={`/?postlist=${pageNum}`}
            onClick={e => {
              if (pageNum === currentPage) e.preventDefault();
            }}
          >
            {pageNum}
          </Link>
        ),
      )}
      <Link
        href={`/?postlist=${currentPage + 1}`}
        className="h-5 w-5 text-center"
        onClick={e => {
          if (currentPage == totalPages) e.preventDefault();
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Link>
    </nav>
  );
}
