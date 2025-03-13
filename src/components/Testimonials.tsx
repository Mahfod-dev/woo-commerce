// components/Testimonials.tsx
export default function Testimonials() {
	const testimonials = [
		{
			id: 1,
			author: 'Alice',
			text: "La personnalisation et l'expérience unique m'ont vraiment convaincue. Une boutique qui ose sortir des sentiers battus !",
		},
		{
			id: 2,
			author: 'Bob',
			text: 'Un design frais et des produits de qualité, je n’ai jamais vu cela sur un site e-commerce avant !',
		},
		{
			id: 3,
			author: 'Claire',
			text: "L'interface est un pur plaisir à parcourir, et l'attention aux détails fait toute la différence.",
		},
		{
			id: 4,
			author: 'David',
			text: 'Innovant et élégant, ce site change totalement la donne en matière de shopping en ligne.',
		},
	];

	return (
		<section className='py-16 bg-gray-50'>
			<div className='max-w-5xl mx-auto px-4'>
				<h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
					Ce qu&apos;ils en pensent
				</h2>
				<div className='columns-1 md:columns-2 gap-6'>
					{testimonials.map((t) => (
						<div
							key={t.id}
							className='mb-6 break-inside p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow'>
							<p className='text-gray-700 italic mb-4'>
								&quot;{t.text}&quot;
							</p>
							<p className='text-right font-bold text-gray-800'>
								- {t.author}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
