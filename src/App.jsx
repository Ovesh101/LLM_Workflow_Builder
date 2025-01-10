import { Toaster } from "react-hot-toast";
import WorkflowCanvas from "./components/WorkFlowCanvas";
import { WorkflowProvider } from "./context/WorkFlowContext";
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Light theme
import 'primereact/resources/primereact.min.css'; // Core styles
import 'primeicons/primeicons.css'; // Icons


const App = () => {
  return (
    <>
      <WorkflowProvider>
        <WorkflowCanvas />
        <Toaster />
      </WorkflowProvider>
    </>
  );
};
export default App;
