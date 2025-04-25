import "./App.css";
import Hero from "./components/Balance";
import AccountStats from "./components/AccountStats";
import History from "./components/History";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";



function App() {
  return (
    <Layout>
    <div>
      <Navbar />
      <div>
        <Hero />
        <AccountStats />
        <History />
      </div>
    </div>
    </Layout>
  );
}

export default App;
