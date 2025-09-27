function Footer() {
  return (
    <footer className="w-full bg-black bg-opacity-70 text-gray-400 text-center py-4 px-2 text-sm md:text-base z-20 fixed bottom-0 left-0">
      <p>© {new Date().getFullYear()} Sneako All rights reserved.</p>
    </footer>
  );
}

export default Footer;