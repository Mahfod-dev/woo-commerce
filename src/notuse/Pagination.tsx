export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	return (
		<div className='flex justify-center space-x-2'>
			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`px-3 py-1 rounded ${
						currentPage === page
							? 'bg-indigo-600 text-white'
							: 'bg-gray-200'
					}`}>
					{page}
				</button>
			))}
		</div>
	);
}
