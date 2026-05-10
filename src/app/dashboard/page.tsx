"use client";

import Image from "next/image";
import { Search, MapPin, Calendar, Star, Plus, Wallet, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Topbar */}
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search trips, destinations..." 
            className="w-full pl-11 pr-4 bg-[#F8F9FA] border border-transparent focus:bg-white focus:border-[#2AB5A0] focus:ring-1 focus:ring-[#2AB5A0] rounded-full h-11 text-sm outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#E6F4F2] text-[#2AB5A0] flex items-center justify-center font-semibold border border-[#2AB5A0]/20">
            A
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-8 pb-12 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, Alex</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Here is an overview of your upcoming adventures and finances.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          {/* Budget Highlights */}
          <div className="col-span-1 border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Budget Highlights</h2>
                <div className="w-9 h-9 rounded-full bg-[#E6F4F2] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#2AB5A0]" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Spent This Month</p>
              <p className="text-[40px] font-bold text-gray-900 tracking-tight">$1,240</p>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between text-sm font-bold mb-2">
                <span className="text-gray-700">$1,240 / $2,000</span>
                <span className="text-[#2AB5A0]">62%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#2AB5A0] h-full rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="col-span-1 xl:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Trips</h2>
              <button className="text-sm font-bold text-[#2AB5A0] hover:text-[#1e8f7d] transition-colors">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Trip 1 */}
              <div className="border border-gray-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-[#2AB5A0] bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-[17px]">Summer in Italy</h3>
                      <div className="flex items-center text-gray-500 text-xs font-medium mt-1.5 gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Aug 12 - Aug 26, 2024</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-[#E6F4F2] text-[#2AB5A0] text-[10px] font-bold uppercase tracking-wider rounded-md">Active</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-6 gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>3 Destinations</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-gray-500">Planning</span>
                    <span className="text-gray-700">80%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#2AB5A0] h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>

              {/* Trip 2 */}
              <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-[17px]">Kyoto Sakura Season</h3>
                      <div className="flex items-center text-gray-500 text-xs font-medium mt-1.5 gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Apr 05 - Apr 15, 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-6 gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>2 Destinations</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-gray-500">Planning</span>
                    <span className="text-gray-700">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#2AB5A0] h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for you */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recommended for you</h2>
            <p className="text-gray-500 text-sm font-medium">Based on your recent searches</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Dest 1 */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm group bg-white hover:shadow-md transition-all">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1522261623490-6750ec252d62?q=80&w=600&auto=format&fit=crop" 
                  alt="Mumbai" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-[#F5A623] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  Top Pick
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                  4.8
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-[17px]">Mumbai</span>
                <Button variant="outline" size="sm" className="text-[#2AB5A0] border-[#2AB5A0]/30 hover:bg-[#E6F4F2] hover:border-[#2AB5A0] h-8 rounded-full px-4 font-bold text-xs transition-colors">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add to Trip
                </Button>
              </div>
            </div>

            {/* Dest 2 */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm group bg-white hover:shadow-md transition-all">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop" 
                  alt="Delhi" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-[#F5A623] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  Trending
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                  4.7
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-[17px]">Delhi</span>
                <Button variant="outline" size="sm" className="text-[#2AB5A0] border-[#2AB5A0]/30 hover:bg-[#E6F4F2] hover:border-[#2AB5A0] h-8 rounded-full px-4 font-bold text-xs transition-colors">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add to Trip
                </Button>
              </div>
            </div>

            {/* Dest 3 */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm group bg-white hover:shadow-md transition-all">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1596440816654-e64e5254ebbb?q=80&w=600&auto=format&fit=crop" 
                  alt="Surat" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute bottom-3 right-3 bg-white/95 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                  4.5
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-[17px]">Surat</span>
                <Button variant="outline" size="sm" className="text-[#2AB5A0] border-[#2AB5A0]/30 hover:bg-[#E6F4F2] hover:border-[#2AB5A0] h-8 rounded-full px-4 font-bold text-xs transition-colors">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add to Trip
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
