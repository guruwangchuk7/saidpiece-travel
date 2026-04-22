import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const regionsData: Record<string, any> = {
    'paro-valley': {
        name: 'Paro Valley',
        heroTitle: 'Paro Valley: Gateway to the Kingdom',
        heroImage: '/images/bhutan/main1.webp',
        introTitle: 'Where Ancient Tradition Meets Sacred Landscapes',
        introText: 'Home to the iconic Tiger\'s Nest Monastery and the country\'s only international airport, Paro Valley is the beautiful first impression of Bhutan for most travelers. This wide, fertile valley is dotted with terraced rice fields, ancient temples, and elegant farmhouses. Beyond its spiritual significance, Paro is a hub of Bhutanese history, housing the National Museum and the impressive Rinpung Dzong.',
        detailedInfo: [
            {
                title: 'Sacred Sites & Architectural Wonders',
                content: 'The valley is dominated by the Taktsang Lhakhang (Tiger\'s Nest), which clings to a granite cliff 900 meters above the valley floor. Legend says Guru Rinpoche flew here on the back of a tigress to meditate. Below in the valley, the Rinpung Dzong stands as a fortress-monastery protecting the region, while the nearby National Museum (Ta Dzong) offers a deep dive into Bhutanese art, history, and biodiversity.'
            },
            {
                title: 'The Living Landscape',
                content: 'Walking through Paro is like stepping back in time. The valley is one of the most productive agricultural regions in Bhutan, famous for its red rice. Visitors can explore traditional farmhouses, participate in archery matches (the national sport), and wander through the charming town of Paro, which has retained its traditional shopfronts and architecture despite being the main gateway for visitors.'
            }
        ],
        trips: [
            {
                id: 'bhutan-walking-tour',
                title: 'Bhutan Walking Tour: The Dragon Kingdom',
                subtitle: 'Small Group Adventure',
                image: '/images/bhutan/main2.webp',
                location: 'Paro, Thimphu, Punakha',
                level: 'Level 3',
                days: '12 Days',
                price: '7,495',
                link: '/trips/bhutan-walking-tour'
            },
            {
                id: 'cultural-crossroads',
                title: 'Cultural Crossroads of Bhutan',
                subtitle: 'Private Journey',
                image: '/images/bhutan/main3.webp',
                location: 'Paro, Thimphu',
                level: 'Level 2',
                days: '10 Days',
                price: '5,995',
                link: '/trips/cultural-crossroads'
            }
        ]
    },
    'thimphu': {
        name: 'Thimphu',
        heroTitle: 'Thimphu: The Modern Heart of Bhutan',
        heroImage: '/images/bhutan/main6.webp',
        introTitle: 'A Capital Like No Other',
        introText: 'Thimphu, the world\'s only capital city without traffic lights, is a fascinating blend of ancient tradition and contemporary Bhutanese life. It serves as the political and economic center of the country while remaining deeply rooted in Buddhist values. Here, modern cafes sit alongside traditional weaving centers and ancient monasteries.',
        detailedInfo: [
            {
                title: 'Spiritual Landmarks',
                content: 'The city is watched over by the Buddha Dordenma, one of the largest Buddha statues in the world, cast in bronze and gilded in gold. In the heart of the city lies the Memorial Chorten, where the elderly and faithful circumambulate the shrine daily. The Tashichho Dzong, an impressive fortress-monastery, houses the throne room and offices of the King.'
            },
            {
                title: 'Arts, Crafts & Culture',
                content: 'Thimphu is the best place to witness Bhutan\'s commitment to its "13 Traditional Arts and Crafts." Visit the National Institute for Zorig Chusum to see students training in painting, woodcarving, and embroidery. The Textile Museum and the Folk Heritage Museum provide further insight into the daily lives and artistic heritage of the Bhutanese people.'
            }
        ],
        trips: [
            {
                id: 'treasures-of-himalayas',
                title: 'Treasures of the Himalayas',
                subtitle: 'Small Group Adventure',
                image: '/images/bhutan/main1.webp',
                location: 'Thimphu, Paro, Kathmandu',
                level: 'Level 2+',
                days: '15 Days',
                price: '11,295',
                link: '/trips/treasures-of-himalayas'
            }
        ]
    },
    'punakha': {
        name: 'Punakha',
        heroTitle: 'Punakha: The Winter Capital',
        heroImage: '/images/bhutan/7.webp',
        introTitle: 'Subtropical Valleys and Majestic Dzongs',
        introText: 'Punakha served as Bhutan\'s capital until 1955 and remains the winter residence of the monastic body. Situated at a lower elevation than Paro or Thimphu, the valley enjoys a subtropical climate, allowing for lush vegetation and two rice harvests a year.',
        detailedInfo: [
            {
                title: 'The Palace of Great Happiness',
                content: 'The Punakha Dzong, or Pungtang Dewa Chhenbi Phodrang, is widely considered the most beautiful dzong in Bhutan. Located at the confluence of the Pho Chhu (Male River) and Mo Chhu (Female River), its white walls and golden roofs create a stunning reflection in the glacial waters. It was here that the first King of Bhutan was crowned in 1907.'
            },
            {
                title: 'The Temple of Fertility',
                content: 'A short walk through rice fields leads to Chimi Lhakhang, the temple of the "Divine Madman," Drukpa Kunley. Known for its unusual traditions and phallus paintings, the temple attracts couples from all over the world seeking blessings for fertility. The surrounding Sopsokha village is a charming example of rural Bhutanese life.'
            }
        ],
        trips: [
            {
                id: 'bhutan-peaks-valleys',
                title: 'Bhutan Peaks & Valleys',
                subtitle: 'Small Group Adventure',
                image: '/images/bhutan/main4.webp',
                location: 'Punakha, Bumthang',
                level: 'Level 4',
                days: '14 Days',
                price: '8,295',
                link: '/trips/bhutan-peaks-valleys'
            }
        ]
    },
    'bumthang': {
        name: 'Bumthang',
        heroTitle: 'Bumthang: The Spiritual Heartland',
        heroImage: '/images/bhutan/8.webp',
        introTitle: 'Ancient Temples and Mystical Legends',
        introText: 'Comprising four distinct valleys—Chokhor, Tang, Ura, and Chhume—Bumthang is the religious heartland of Bhutan. This region is steeped in the history of Guru Rinpoche and the great treasure-discoverer Pema Lingpa, making it a pilgrimage site for Buddhists across the Himalayas.',
        detailedInfo: [
            {
                title: 'A Tapestry of Temples',
                content: 'Bumthang houses some of the oldest temples in the kingdom, including Jambay Lhakhang (7th century) and Kurjey Lhakhang, where Guru Rinpoche left his body imprint in a rock. The valley of Tang is home to the "Burning Lake" (Mebar Tsho), where Pema Lingpa is said to have dived with a butter lamp and emerged with sacred treasures.'
            },
            {
                title: 'The Alpine Beauty of Ura',
                content: 'The valley of Ura, the highest of Bumthang\'s valleys, offers a glimpse into a more traditional and rustic lifestyle. The village of Ura is famous for its clustered houses and cobblestone paths, surrounded by sheep pastures and potato fields. It\'s a perfect region for those looking to hike through ancient forests and high-altitude meadows.'
            }
        ],
        trips: [
            {
                id: 'bhutan-peaks-valleys',
                title: 'Bhutan Peaks & Valleys',
                subtitle: 'Small Group Adventure',
                image: '/images/bhutan/main4.webp',
                location: 'Bumthang, Gangtey',
                level: 'Level 4',
                days: '14 Days',
                price: '8,295',
                link: '/trips/bhutan-peaks-valleys'
            }
        ]
    },
    'gangtey-phobjikha': {
        name: 'Gangtey & Phobjikha',
        heroTitle: 'Gangtey & Phobjikha: Valley of the Cranes',
        heroImage: '/images/bhutan/9.webp',
        introTitle: 'Pristine Glacial Valleys and Rare Wildlife',
        introText: 'Phobjikha is a vast, U-shaped glacial valley that serves as one of the most important wildlife preserves in the country. It is famous as the winter home for the rare and endangered Black-necked Cranes that migrate from the Tibetan Plateau every year between October and March.',
        detailedInfo: [
            {
                title: 'Gangtey Goempa',
                content: 'Overlooking the valley is the Gangtey Monastery, a 17th-century masterpiece of Nyingma Buddhism. The monastery has been recently restored, showcasing exquisite woodcarvings and vibrant murals. The annual Crane Festival held here celebrates the return of the sacred birds with traditional mask dances.'
            },
            {
                title: 'The Nature Trail',
                content: 'One of the best ways to experience the valley is by walking the Gangtey Nature Trail. This easy 1.5-hour hike winds through pine forests, past traditional villages, and along the edge of the wetlands, offering spectacular views of the valley floor and the wandering cranes.'
            }
        ],
        trips: [
            {
                id: 'bhutan-walking-tour',
                title: 'Bhutan Walking Tour',
                subtitle: 'Small Group Adventure',
                image: '/images/bhutan/main2.webp',
                location: 'Gangtey, Phobjikha',
                level: 'Level 3',
                days: '12 Days',
                price: '7,495',
                link: '/trips/bhutan-walking-tour'
            }
        ]
    },
    'haa-valley': {
        name: 'Haa Valley',
        heroTitle: 'Haa Valley: The Hidden Gem',
        heroImage: '/images/bhutan/10.webp',
        introTitle: 'Remote Beauty and Traditional Culture',
        introText: 'Opened to tourists only in 2002, Haa Valley remains one of the most pristine and least visited regions in Bhutan. Located near the border with Tibet, it is guarded by three sacred mountains—the "Rigsum Goenpo"—representing wisdom, compassion, and power.',
        detailedInfo: [
            {
                title: 'Ancestral Traditions',
                content: 'The people of Haa, known as Haaps, have preserved unique shamanistic traditions that predate Buddhism. The valley is famous for its "Haa Hoentey" (buckwheat dumplings) and its summer festival, which showcases nomadic lifestyles and traditional sports. Visiting a local farmhouse here offers a truly authentic glimpse into Bhutanese rural life.'
            },
            {
                title: 'The White & Black Temples',
                content: 'Lhakhang Karpo (White Temple) and Lhakhang Nagpo (Black Temple) are the spiritual anchors of the valley. According to legend, they were built by the Tibetan King Songtsen Gampo in the 7th century to pin down a demoness. The serene atmosphere of these temples reflects the quiet, meditative nature of the entire valley.'
            }
        ],
        trips: [
            {
                id: 'cultural-crossroads',
                title: 'Cultural Crossroads of Bhutan',
                subtitle: 'Private Journey',
                image: '/images/bhutan/main3.webp',
                location: 'Haa, Paro',
                level: 'Level 2',
                days: '10 Days',
                price: '5,995',
                link: '/trips/cultural-crossroads'
            }
        ]
    },
    'eastern-bhutan': {
        name: 'Eastern Bhutan',
        heroTitle: 'Eastern Bhutan: The Last Frontier',
        heroImage: '/images/bhutan/11.webp',
        introTitle: 'Untouched Wilderness and Ancient Crafts',
        introText: 'Eastern Bhutan is a region of steep hills, deep valleys, and incredible biodiversity. It is the least traveled part of the country, offering a sense of exploration and discovery that is hard to find elsewhere. Here, the landscape is rugged and the culture is distinctly different from the west.',
        detailedInfo: [
            {
                title: 'The Art of Weaving',
                content: 'The east is the textile heartland of Bhutan. In regions like Lhuentse and Trashigang, women weave intricate "Kishuthara" silk textiles that are highly prized throughout the kingdom. Visitors can witness the entire process, from natural dyeing to the complex backstrap loom techniques passed down through generations.'
            },
            {
                title: 'Merak & Sakteng',
                content: 'This remote corner is home to the Brokpa people, semi-nomadic yak herders with a unique language and distinct dress, including their iconic felt hats with five "tails." The Merak-Sakteng region, recently opened to visitors, offers a rare opportunity to experience a culture that has remained virtually unchanged for centuries.'
            }
        ],
        trips: [
            {
                id: 'bhutan-peaks-valleys',
                title: 'Bhutan Peaks & Valleys',
                subtitle: 'Small Group Adventure',
                image: '/images/bhutan/main4.webp',
                location: 'Trashigang, Lhuentse',
                level: 'Level 4',
                days: '14 Days',
                price: '8,295',
                link: '/trips/bhutan-peaks-valleys'
            }
        ]
    }
};

import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const region = regionsData[slug];

    if (!region) {
        notFound();
    }

    return (
        <main className="new-trips-page pt-0">
            <HeaderThemeHandler theme="auto" />
            {/* Hero Section */}
            <section className="new-trips-hero">
                <div className="hero-bg-wrapper">
                    <Image
                        src={region.heroImage}
                        alt={region.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="hero-overlay-subtle"></div>
                </div>
                <div className="container hero-content-inner">
                    <span className="hero-category">DESTINATIONS</span>
                    <h1>{region.heroTitle}</h1>
                </div>
            </section>

            {/* Intro Section */}
            <section className="new-trips-intro container">
                <div className="intro-text-block" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', textAlign: 'left', alignItems: 'start' }}>
                    <div>
                        <h2 className="section-title" style={{ fontSize: '2.8rem', marginTop: '0', lineHeight: '1.2' }}>{region.introTitle}</h2>
                    </div>
                    <div>
                        <p style={{ fontSize: '1.2rem', textAlign: 'left', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '40px' }}>
                            {region.introText}
                        </p>
                    </div>
                </div>
            </section>

            {/* Detailed Content Sections */}
            <section className="container" style={{ marginBottom: '100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                    {region.detailedInfo.map((info: any, idx: number) => (
                        <div key={idx} style={{ padding: '40px', background: 'var(--color-cream)', borderRadius: '4px' }}>
                            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', marginBottom: '20px', color: 'var(--color-brand)' }}>{info.title}</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>{info.content}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trips Section */}
            <section className="trips-section container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', borderBottom: '1px solid #EEE', paddingBottom: '20px' }}>
                    <h2 className="section-title" style={{ marginBottom: '0' }}>Featured Journeys to {region.name}</h2>
                    <Link href="/browse" className="view-trip-btn" style={{ fontSize: '0.9rem' }}>VIEW ALL TRIPS</Link>
                </div>

                <div className="trips-grid-4">
                    {region.trips.map((trip: any) => (
                        <div key={trip.id} className="trip-card-detailed">
                            <div className="trip-card-top">
                                <div className="trip-image-wrap">
                                    <Image src={trip.image} alt={trip.title} fill style={{ objectFit: 'cover' }} />
                                </div>
                            </div>
                            <div className="trip-card-body">
                                <div className="trip-subtitle-box">{trip.subtitle}</div>
                                <h3 className="trip-title">{trip.title}</h3>

                                <ul className="trip-info-list">
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {trip.location}
                                    </li>
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="20" x2="12" y2="10"></line>
                                            <line x1="18" y1="20" x2="18" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="16"></line>
                                        </svg>
                                        {trip.level}
                                    </li>
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        {trip.days}
                                    </li>
                                </ul>
                            </div>
                            <div className="trip-card-footer">
                                <div className="trip-price">From ${trip.price}</div>
                                <Link href={trip.link} className="view-trip-btn">VIEW TRIP</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
