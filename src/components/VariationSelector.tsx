'use client';

import React, { useState, useEffect } from 'react';
import { WooVariation, WooAttribute } from '@/lib/woo';
import { formatPrice } from '@/lib/wooClient';

interface VariationSelectorProps {
	productId: number;
	variations: WooVariation[];
	attributes: WooAttribute[];
	onVariationChange: (variationId: number | null, variation: WooVariation | null) => void;
}

export default function VariationSelector({
	variations,
	attributes,
	onVariationChange,
}: VariationSelectorProps) {
	const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
	const [selectedVariation, setSelectedVariation] = useState<WooVariation | null>(null);

	// Filter attributes that are used for variations
	const variationAttributes = attributes.filter(attr => attr.variation);

	// Find matching variation based on selected attributes
	useEffect(() => {
		if (Object.keys(selectedAttributes).length === variationAttributes.length) {
			const matchingVariation = variations.find(variation => {
				return variation.attributes.every(varAttr => {
					const selectedValue = selectedAttributes[varAttr.name];
					return selectedValue && selectedValue.toLowerCase() === varAttr.option.toLowerCase();
				});
			});

			setSelectedVariation(matchingVariation || null);
			onVariationChange(matchingVariation?.id || null, matchingVariation || null);
		} else {
			setSelectedVariation(null);
			onVariationChange(null, null);
		}
	}, [selectedAttributes, variations, variationAttributes.length, onVariationChange]);

	const handleAttributeChange = (attributeName: string, value: string) => {
		setSelectedAttributes(prev => ({
			...prev,
			[attributeName]: value
		}));
	};

	const isOptionAvailable = (attributeName: string, option: string): boolean => {
		// Check if this option is available in any variation
		// considering the currently selected attributes
		const otherSelectedAttrs = Object.entries(selectedAttributes)
			.filter(([name]) => name !== attributeName);

		return variations.some(variation => {
			// Check if this variation has the option we're testing
			const hasOption = variation.attributes.some(
				attr => attr.name === attributeName && attr.option.toLowerCase() === option.toLowerCase()
			);

			if (!hasOption) return false;

			// Check if this variation matches other selected attributes
			const matchesOthers = otherSelectedAttrs.every(([name, value]) => {
				return variation.attributes.some(
					attr => attr.name === name && attr.option.toLowerCase() === value.toLowerCase()
				);
			});

			return matchesOthers && variation.stock_status === 'instock';
		});
	};

	const renderColorAttribute = (attribute: WooAttribute) => {
		return (
			<div key={attribute.name} className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-3">
					{attribute.name}
					{selectedAttributes[attribute.name] && (
						<span className="ml-2 text-gray-500">
							: {selectedAttributes[attribute.name]}
						</span>
					)}
				</label>
				<div className="flex flex-wrap gap-3">
					{attribute.options.map((option) => {
						const isSelected = selectedAttributes[attribute.name] === option;
						const isAvailable = isOptionAvailable(attribute.name, option);

						return (
							<button
								key={option}
								type="button"
								onClick={() => handleAttributeChange(attribute.name, option)}
								disabled={!isAvailable}
								className={`
									relative w-12 h-12 rounded-full border-2 transition-all
									${isSelected
										? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
										: 'border-gray-300 hover:border-gray-400'
									}
									${!isAvailable && 'opacity-30 cursor-not-allowed'}
								`}
								style={{
									backgroundColor: option.toLowerCase()
								}}
								title={option}
								aria-label={option}
							>
								{!isAvailable && (
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-full h-0.5 bg-gray-400 rotate-45 transform origin-center"></div>
									</div>
								)}
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	const renderSelectAttribute = (attribute: WooAttribute) => {
		return (
			<div key={attribute.name} className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-3">
					{attribute.name}
				</label>
				<div className="flex flex-wrap gap-2">
					{attribute.options.map((option) => {
						const isSelected = selectedAttributes[attribute.name] === option;
						const isAvailable = isOptionAvailable(attribute.name, option);

						return (
							<button
								key={option}
								type="button"
								onClick={() => handleAttributeChange(attribute.name, option)}
								disabled={!isAvailable}
								className={`
									px-4 py-2 rounded-lg border-2 transition-all font-medium
									${isSelected
										? 'border-blue-600 bg-blue-50 text-blue-700'
										: 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
									}
									${!isAvailable && 'opacity-30 cursor-not-allowed line-through'}
								`}
							>
								{option}
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-4">
			{variationAttributes.map((attribute) => {
				// Check if this is a color attribute based on name
				const isColorAttribute =
					attribute.name.toLowerCase().includes('color') ||
					attribute.name.toLowerCase().includes('couleur');

				return isColorAttribute
					? renderColorAttribute(attribute)
					: renderSelectAttribute(attribute);
			})}

			{selectedVariation && (
				<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Prix de cette variation</p>
							<p className="text-2xl font-bold text-gray-900">
								{formatPrice(parseFloat(selectedVariation.price))}
							</p>
							{selectedVariation.on_sale && selectedVariation.regular_price && (
								<p className="text-sm text-gray-500 line-through">
									{formatPrice(parseFloat(selectedVariation.regular_price))}
								</p>
							)}
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-600">Disponibilité</p>
							<p className={`text-sm font-medium ${
								selectedVariation.stock_status === 'instock'
									? 'text-green-600'
									: 'text-red-600'
							}`}>
								{selectedVariation.stock_status === 'instock'
									? 'En stock'
									: 'Rupture de stock'
								}
							</p>
							{selectedVariation.stock_quantity !== null && (
								<p className="text-sm text-gray-500">
									{selectedVariation.stock_quantity} disponible(s)
								</p>
							)}
						</div>
					</div>
				</div>
			)}

			{variationAttributes.length > 0 && !selectedVariation && (
				<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-sm text-yellow-800">
						Veuillez sélectionner toutes les options pour continuer
					</p>
				</div>
			)}
		</div>
	);
}
