'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Testimonials from '@/components/Testimonials';
import '../styles/testimonials.css';

// Données de témoignages supplémentaires
const additionalTestimonials = [
  {
    id: 5,
    author: 'Julie',
    role: 'Cliente depuis 3 ans',
    text: "J'ai découvert cette boutique il y a 3 ans et depuis je ne commande plus ailleurs. La qualité des produits est incroyable et le service client est toujours là pour répondre à mes questions.",
    image: '/img/team-lina.jpg',
    rating: 5,
  },
  {
    id: 6,
    author: 'Marc',
    role: 'Client régulier',
    text: "Ce qui me plaît le plus, c'est l'attention aux détails dans les emballages et la rapidité des livraisons. On sent vraiment que l'équipe se soucie de ses clients.",
    image: '/img/team-marc.jpg',
    rating: 5,
  },
  {
    id: 7,
    author: 'Élise',
    role: 'Nouvelle cliente',
    text: "J'ai été agréablement surprise par la qualité des produits et par la facilité d'utilisation du site. Je recommande vivement cette boutique à tous mes amis et ma famille.",
    image: '/img/team-elise.jpg',
    rating: 4,
  },
  {
    id: 8,
    author: 'Alexandre',
    role: 'Client fidèle',
    text: "Le rapport qualité-prix est imbattable ! J'apprécie aussi les petites attentions et les échantillons qui accompagnent parfois mes commandes. Une boutique qui sait fidéliser ses clients.",
    image: '/img/quality-focus.jpg',
    rating: 5,
  },
];

export default function TestimonialsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white testimonial-page">
      {/* Section héro */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 testimonial-heading">
              Ce que nos clients disent de nous
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Découvrez les expériences authentiques de nos clients et pourquoi ils continuent à nous faire confiance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section testimonials principale */}
      <Testimonials />

      {/* Section avec grille de témoignages supplémentaires */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 testimonial-heading">
              Plus d'avis de nos clients satisfaits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous sommes fiers de la satisfaction de nos clients et des relations durables que nous avons construites au fil des années.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {additionalTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden testimonial-card"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 testimonial-image">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 testimonial-author">{testimonial.author}</h3>
                      <p className="text-sm text-indigo-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4 star-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4 testimonial-quote">"{testimonial.text}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section sur la façon dont nous collectons les avis */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 testimonial-heading">
                Comment nous collectons vos avis
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Nous valorisons l'honnêteté et la transparence. Tous les avis présentés sur notre site sont authentiques et vérifiés.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Nous envoyons automatiquement une demande d'avis après chaque achat
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Chaque avis est vérifié pour confirmer qu'il vient d'un client réel
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-indigo-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Nous publions tous les avis, positifs comme négatifs, pour une transparence totale
                  </span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/img/quality-testing.jpg"
                  alt="Test de qualité"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white text-xl font-medium">
                      Votre avis compte pour nous et aide d'autres clients à faire des choix éclairés
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section CTA pour partager son expérience */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-6 testimonial-heading">
              Partagez votre propre expérience
            </h2>
            <p className="text-lg text-indigo-100 mb-8">
              Votre avis est important et aide d'autres clients à faire le bon choix. Partagez votre expérience avec nos produits et services.
            </p>
            <Link href="/contact" className="inline-block bg-white text-indigo-600 font-medium px-8 py-4 rounded-full shadow-lg hover:bg-indigo-50 transition duration-300 cta-button">
              Laisser un avis
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}