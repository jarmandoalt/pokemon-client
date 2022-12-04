import { Provider } from "react-redux";
import { store, persistor } from "./store/index.jsx";
import NotFound from "./pages/NotFoud";
import { PersistGate } from "redux-persist/integration/react";
import CrudApi from "./pages/CrudApi";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Room from "./pages/Room";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/home" element={<CrudApi />} />
            <Route exact path="/home/room" element={<Room />} />
            <Route element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
