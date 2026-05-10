import 'dotenv/config';
import { prisma } from '../src/lib/database/prisma/client';

async function main() {
    console.log('Start seeding Global Destinations...');

    const destinations = [
        {
            name: "Mumbai",
            region: "Maharashtra",
            description: "The City of Dreams. A bustling metropolis blending colonial history with modern energy.",
            imageUrl: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f",
            costIndex: "$$$",
            dailyBudget: 120,
            activities: {
                create: [
                    { title: "Gateway of India", type: "CULTURE", duration: "2 Hours", estimatedCost: 10 },
                    { title: "Marine Drive Sunset", type: "SCENIC", duration: "1.5 Hours", estimatedCost: 0 },
                    { title: "Elephanta Caves Tour", type: "ACTIVITY", duration: "4 Hours", estimatedCost: 25 },
                ]
            }
        },
        {
            name: "Surat",
            region: "Gujarat",
            description: "The Diamond City. Famous for its vibrant textile markets, diamond cutting, and street food.",
            imageUrl: "https://images.unsplash.com/photo-1626014903706-5eb888eb4214",
            costIndex: "$$",
            dailyBudget: 70,
            activities: {
                create: [
                    { title: "Dumas Beach Walk", type: "SCENIC", duration: "2 Hours", estimatedCost: 5 },
                    { title: "Diamond Market Tour", type: "ACTIVITY", duration: "3 Hours", estimatedCost: 15 },
                    { title: "Street Food Crawl (Piplod)", type: "FOOD", duration: "2 Hours", estimatedCost: 20 },
                ]
            }
        },
        {
            name: "Jaipur",
            region: "Rajasthan",
            description: "The Pink City. A royal experience filled with majestic forts, palaces, and vibrant bazaars.",
            imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245",
            costIndex: "$$",
            dailyBudget: 85,
            activities: {
                create: [
                    { title: "Amer Fort Exploration", type: "CULTURE", duration: "4 Hours", estimatedCost: 15 },
                    { title: "Hawa Mahal Photography", type: "SCENIC", duration: "1 Hour", estimatedCost: 5 },
                    { title: "Johari Bazaar Shopping", type: "ACTIVITY", duration: "3 Hours", estimatedCost: 40 },
                ]
            }
        },
        {
            name: "Kochi",
            region: "Kerala",
            description: "Queen of the Arabian Sea. A tranquil coastal city known for its historic spice markets.",
            imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
            costIndex: "$$",
            dailyBudget: 75,
            activities: {
                create: [
                    { title: "Chinese Fishing Nets", type: "SCENIC", duration: "1 Hour", estimatedCost: 0 },
                    { title: "Fort Kochi Heritage Walk", type: "CULTURE", duration: "2 Hours", estimatedCost: 10 },
                    { title: "Backwater Boat Cruise", type: "TRANSPORT", duration: "3 Hours", estimatedCost: 35 },
                ]
            }
        },
        {
            name: "Delhi",
            region: "National Capital Territory",
            description: "Heart of the Nation. A massive metropolitan area with a deep, layered history.",
            imageUrl: "https://images.unsplash.com/photo-1587474260580-20fb970678ad",
            costIndex: "$$$",
            dailyBudget: 110,
            activities: {
                create: [
                    { title: "Red Fort Tour", type: "CULTURE", duration: "3 Hours", estimatedCost: 12 },
                    { title: "India Gate Evening Walk", type: "SCENIC", duration: "1.5 Hours", estimatedCost: 0 },
                    { title: "Chandni Chowk Food Tour", type: "FOOD", duration: "3 Hours", estimatedCost: 25 },
                ]
            }
        }
    ];

    for (const dest of destinations) {
        const createdDest = await prisma.globalDestination.upsert({
            where: { name: dest.name },
            update: {},
            create: dest,
        });
        console.log(`Created destination: ${createdDest.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });