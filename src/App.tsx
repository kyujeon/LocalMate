import { MainCard } from "./components/Skeleton";

function App() {
  return (
    <div className="w-full mt-4">
      <section
        className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    gap-8
    px-6
    lg:px-36
  "
      >
        <MainCard />
        <MainCard />
        <MainCard />
        <MainCard />
        <MainCard />
        <MainCard />
      </section>
    </div>
  );
}

export default App;
