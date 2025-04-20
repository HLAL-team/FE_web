import React from 'react';
import Layout from '../components/Layout';
import Navbar from "../components/Navbar";
import History from '../components/History';
import BarChart from '../components/BarChart';


const TrackerPage = () => {
  return (
    <Layout>
      <div>
        <Navbar />

        <div className='mx-8 p'>

        <div>
          <h2 className="text-4xl text-left font-semibold">Monthly Tracker</h2>
        </div>
        <BarChart />
        <div>
          <div className="flex justify-between gap-8 px-36 mt-4 mb-16 text-left">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-900">Total Income</h2>
              <p className="text-2xl font-bold text-[#057268]">Rp 5,000,000</p>
            </div>

            {/* Total Outcome */}
            <div className="w-full md:w-1/2 text-right">
              <h2 className="text-xl font-semibold text-gray-900">Total Outcome</h2>
              <p className="text-2xl font-bold text-[#674729]">Rp 5,000,000</p>
            </div>
          </div>
        </div>
        </div>


        <div>
          <History />
        </div>
      </div>
    </Layout>
  );
};

export default TrackerPage;