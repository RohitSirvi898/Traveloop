import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check if user already has trips
        const existing = await prisma.trip.count({ where: { userId } });
        if (existing > 0) {
            return NextResponse.json({ message: "User already has trips", count: existing });
        }

        // Create Trip 1: Euro Trip
        const trip1 = await prisma.trip.create({
            data: {
                userId,
                title: "Euro Trip 2026",
                description: "Backpacking across Europe — Paris, Rome, and Barcelona",
                startDate: new Date("2026-06-10"),
                endDate: new Date("2026-06-25"),
                isPublic: true,
                totalBudget: 150000,
                stops: {
                    create: [
                        {
                            cityName: "Paris",
                            startDate: new Date("2026-06-10"),
                            endDate: new Date("2026-06-15"),
                            budget: 60000,
                            activities: {
                                create: [
                                    {
                                        title: "Eiffel Tower Visit",
                                        description: "Climb to the top for the best panoramic view of Paris",
                                        cost: 2500,
                                        type: "SCENIC",
                                        startTime: new Date("2026-06-11T10:00:00Z"),
                                        endTime: new Date("2026-06-11T13:00:00Z"),
                                    },
                                    {
                                        title: "Louvre Museum",
                                        description: "See the Mona Lisa and thousands of masterpieces",
                                        cost: 1700,
                                        type: "CULTURE",
                                        startTime: new Date("2026-06-12T09:00:00Z"),
                                        endTime: new Date("2026-06-12T14:00:00Z"),
                                    },
                                    {
                                        title: "Dinner at Le Jules Verne",
                                        description: "Fine dining inside the Eiffel Tower",
                                        cost: 15000,
                                        type: "FOOD",
                                        startTime: new Date("2026-06-11T19:00:00Z"),
                                        endTime: new Date("2026-06-11T21:00:00Z"),
                                    },
                                    {
                                        title: "Seine River Cruise",
                                        description: "Evening boat ride along the Seine",
                                        cost: 1800,
                                        type: "ENTERTAINMENT",
                                        startTime: new Date("2026-06-13T18:00:00Z"),
                                        endTime: new Date("2026-06-13T20:00:00Z"),
                                    },
                                    {
                                        title: "Cafe Breakfast at Montmartre",
                                        description: "Croissants and coffee with a view",
                                        cost: 800,
                                        type: "FOOD",
                                        startTime: new Date("2026-06-12T08:00:00Z"),
                                        endTime: new Date("2026-06-12T09:00:00Z"),
                                    },
                                ]
                            }
                        },
                        {
                            cityName: "Rome",
                            startDate: new Date("2026-06-15"),
                            endDate: new Date("2026-06-20"),
                            budget: 50000,
                            activities: {
                                create: [
                                    {
                                        title: "Colosseum Tour",
                                        description: "Guided tour of the ancient arena",
                                        cost: 3000,
                                        type: "CULTURE",
                                        startTime: new Date("2026-06-16T09:00:00Z"),
                                        endTime: new Date("2026-06-16T12:00:00Z"),
                                    },
                                    {
                                        title: "Vatican Museums",
                                        description: "Sistine Chapel and St. Peter's Basilica",
                                        cost: 2800,
                                        type: "CULTURE",
                                        startTime: new Date("2026-06-17T08:30:00Z"),
                                        endTime: new Date("2026-06-17T13:00:00Z"),
                                    },
                                    {
                                        title: "Pasta Making Class",
                                        description: "Learn authentic Italian pasta from scratch",
                                        cost: 4500,
                                        type: "FOOD",
                                        startTime: new Date("2026-06-18T16:00:00Z"),
                                        endTime: new Date("2026-06-18T19:00:00Z"),
                                    },
                                    {
                                        title: "Trevi Fountain Walk",
                                        description: "Toss a coin and explore the piazza",
                                        cost: 0,
                                        type: "SCENIC",
                                        startTime: new Date("2026-06-16T15:00:00Z"),
                                        endTime: new Date("2026-06-16T16:30:00Z"),
                                    },
                                ]
                            }
                        },
                        {
                            cityName: "Barcelona",
                            startDate: new Date("2026-06-20"),
                            endDate: new Date("2026-06-25"),
                            budget: 40000,
                            activities: {
                                create: [
                                    {
                                        title: "Sagrada Familia",
                                        description: "Gaudi's iconic masterpiece cathedral",
                                        cost: 2600,
                                        type: "CULTURE",
                                        startTime: new Date("2026-06-21T10:00:00Z"),
                                        endTime: new Date("2026-06-21T13:00:00Z"),
                                    },
                                    {
                                        title: "La Boqueria Market",
                                        description: "Fresh tapas and local street food",
                                        cost: 1200,
                                        type: "FOOD",
                                        startTime: new Date("2026-06-22T12:00:00Z"),
                                        endTime: new Date("2026-06-22T14:00:00Z"),
                                    },
                                    {
                                        title: "Barceloneta Beach",
                                        description: "Relax by the Mediterranean",
                                        cost: 0,
                                        type: "SCENIC",
                                        startTime: new Date("2026-06-23T10:00:00Z"),
                                        endTime: new Date("2026-06-23T16:00:00Z"),
                                    },
                                ]
                            }
                        }
                    ]
                },
                expenses: {
                    create: [
                        { category: "Transport", description: "Flight Delhi → Paris", quantity: 1, unitCost: 45000, totalAmount: 45000 },
                        { category: "Transport", description: "Train Paris → Rome", quantity: 1, unitCost: 8000, totalAmount: 8000 },
                        { category: "Transport", description: "Flight Rome → Barcelona", quantity: 1, unitCost: 6000, totalAmount: 6000 },
                        { category: "Hotel", description: "Airbnb in Paris (5 nights)", quantity: 5, unitCost: 5000, totalAmount: 25000 },
                        { category: "Hotel", description: "Hotel in Rome (5 nights)", quantity: 5, unitCost: 4500, totalAmount: 22500 },
                        { category: "Hotel", description: "Hostel in Barcelona (5 nights)", quantity: 5, unitCost: 3000, totalAmount: 15000 },
                        { category: "Meals", description: "Daily food budget", quantity: 15, unitCost: 1500, totalAmount: 22500 },
                        { category: "Activities", description: "Museum passes & tickets", quantity: 1, unitCost: 8000, totalAmount: 8000 },
                    ]
                },
                checklist: {
                    create: [
                        { category: "Documents", itemName: "Passport", isPacked: true },
                        { category: "Documents", itemName: "Travel Insurance", isPacked: false },
                        { category: "Documents", itemName: "Hotel Confirmations", isPacked: false },
                        { category: "Clothing", itemName: "T-Shirts (5)", isPacked: false },
                        { category: "Clothing", itemName: "Jeans (2)", isPacked: false },
                        { category: "Clothing", itemName: "Walking Shoes", isPacked: true },
                        { category: "Electronics", itemName: "Camera + Charger", isPacked: false },
                        { category: "Electronics", itemName: "Power Adapter (EU)", isPacked: false },
                        { category: "Toiletries", itemName: "Sunscreen", isPacked: false },
                    ]
                }
            }
        });

        // Create Trip 2: Goa Weekend
        const trip2 = await prisma.trip.create({
            data: {
                userId,
                title: "Goa Weekend Getaway",
                description: "Relaxing beach weekend with friends",
                startDate: new Date("2026-05-15"),
                endDate: new Date("2026-05-18"),
                isPublic: true,
                totalBudget: 25000,
                stops: {
                    create: [
                        {
                            cityName: "Goa",
                            startDate: new Date("2026-05-15"),
                            endDate: new Date("2026-05-18"),
                            budget: 20000,
                            activities: {
                                create: [
                                    {
                                        title: "Baga Beach",
                                        description: "Swimming, sunbathing, and water sports",
                                        cost: 0,
                                        type: "SCENIC",
                                        startTime: new Date("2026-05-16T10:00:00Z"),
                                        endTime: new Date("2026-05-16T15:00:00Z"),
                                    },
                                    {
                                        title: "Old Goa Churches",
                                        description: "Visit the Basilica of Bom Jesus and Se Cathedral",
                                        cost: 0,
                                        type: "CULTURE",
                                        startTime: new Date("2026-05-17T09:00:00Z"),
                                        endTime: new Date("2026-05-17T12:00:00Z"),
                                    },
                                    {
                                        title: "Seafood Dinner at Fisherman's Wharf",
                                        description: "Fresh catch of the day by the river",
                                        cost: 3000,
                                        type: "FOOD",
                                        startTime: new Date("2026-05-16T20:00:00Z"),
                                        endTime: new Date("2026-05-16T22:00:00Z"),
                                    },
                                    {
                                        title: "Dudhsagar Falls Day Trip",
                                        description: "Jeep safari to the famous waterfall",
                                        cost: 2500,
                                        type: "ACTIVITY",
                                        startTime: new Date("2026-05-17T06:00:00Z"),
                                        endTime: new Date("2026-05-17T18:00:00Z"),
                                    }
                                ]
                            }
                        }
                    ]
                },
                expenses: {
                    create: [
                        { category: "Transport", description: "Flight tickets", quantity: 2, unitCost: 4500, totalAmount: 9000 },
                        { category: "Hotel", description: "Beach Resort (3 nights)", quantity: 3, unitCost: 3500, totalAmount: 10500 },
                        { category: "Transport", description: "Scooter Rental", quantity: 3, unitCost: 500, totalAmount: 1500 },
                        { category: "Meals", description: "Daily food", quantity: 3, unitCost: 1000, totalAmount: 3000 },
                    ]
                }
            }
        });

        // Create Trip 3: Rajasthan Heritage
        const trip3 = await prisma.trip.create({
            data: {
                userId,
                title: "Rajasthan Heritage Tour",
                description: "Exploring the forts, palaces, and deserts of Rajasthan",
                startDate: new Date("2026-09-01"),
                endDate: new Date("2026-09-08"),
                isPublic: false,
                totalBudget: 80000,
                stops: {
                    create: [
                        {
                            cityName: "Jaipur",
                            startDate: new Date("2026-09-01"),
                            endDate: new Date("2026-09-04"),
                            budget: 30000,
                            activities: {
                                create: [
                                    {
                                        title: "Amber Fort",
                                        description: "Elephant ride and fort exploration",
                                        cost: 1500,
                                        type: "CULTURE",
                                        startTime: new Date("2026-09-02T09:00:00Z"),
                                        endTime: new Date("2026-09-02T13:00:00Z"),
                                    },
                                    {
                                        title: "Hawa Mahal",
                                        description: "The Palace of Winds",
                                        cost: 200,
                                        type: "SCENIC",
                                        startTime: new Date("2026-09-02T15:00:00Z"),
                                        endTime: new Date("2026-09-02T16:30:00Z"),
                                    },
                                ]
                            }
                        },
                        {
                            cityName: "Udaipur",
                            startDate: new Date("2026-09-04"),
                            endDate: new Date("2026-09-08"),
                            budget: 35000,
                            activities: {
                                create: [
                                    {
                                        title: "Lake Pichola Boat Ride",
                                        description: "Sunset boat ride with palace views",
                                        cost: 800,
                                        type: "SCENIC",
                                        startTime: new Date("2026-09-05T17:00:00Z"),
                                        endTime: new Date("2026-09-05T19:00:00Z"),
                                    },
                                    {
                                        title: "City Palace Museum",
                                        description: "Explore the grand City Palace complex",
                                        cost: 300,
                                        type: "CULTURE",
                                        startTime: new Date("2026-09-06T10:00:00Z"),
                                        endTime: new Date("2026-09-06T13:00:00Z"),
                                    },
                                ]
                            }
                        }
                    ]
                },
                expenses: {
                    create: [
                        { category: "Transport", description: "Train tickets", quantity: 2, unitCost: 2000, totalAmount: 4000 },
                        { category: "Hotel", description: "Heritage Haveli stays", quantity: 7, unitCost: 4000, totalAmount: 28000 },
                        { category: "Activities", description: "Entry tickets & guides", quantity: 1, unitCost: 3000, totalAmount: 3000 },
                    ]
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: "Created 3 demo trips with activities, expenses, and checklists",
            trips: [
                { id: trip1.id, title: trip1.title },
                { id: trip2.id, title: trip2.title },
                { id: trip3.id, title: trip3.title },
            ]
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
