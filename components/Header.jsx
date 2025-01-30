const Header = () => {
  return (
    <header className="bg-[#070809] text-white border-dashed border-b-2">
      <div className="max-w-[1440px] w-full mx-auto p-4 flex justify-between items-center">
        <h1 className="text-[30px] font-bold">Check_404</h1>
        <nav>
          <a href="/" className="hover:underline px-4">
            Home
          </a>
          <a href="/about" className="hover:underline px-4">
            About
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
