const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};
const Logo = () => {
  return (
    <div className="logo">
      <h1>Movies List</h1>
    </div>
  );
};
const NumResult = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
};

const Search = ({ query, setQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const Loader = () => {
  return <p className="loader"> Loading...</p>;
};

const ErrorMessage = ({ message }) => {
  return <p className="error">{message}</p>;
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

export { NumResult, NavBar, Search, Loader, ErrorMessage, Main };
