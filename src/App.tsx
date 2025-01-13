import MaxWidthWrapper from "./components/MaxWidthWrapper";
import KanbanBoard from "./layouts/KanbanBoard";
import Navbar from "./layouts/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <MaxWidthWrapper className="mt-4">
        <KanbanBoard />
      </MaxWidthWrapper>
    </>
  );
}

export default App;
