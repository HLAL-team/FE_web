const Layout = ({ children }) => {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    );
  };
  
  export default Layout;
  