import { Routes, Route } from "react-router-dom";

import Home from "./componenets/Home";
import PorkList from "./componenets/cerdas/PorkList";
import PorkDetails from "./componenets/cerdas/PorkDetails";
import Register from "./componenets/cerdas/RegisterPork";
import Updater from "./componenets/cerdas/UpdaterPork";
import ParicionForm from "./componenets/pariciones/ParicionForm";
import ParicionUpdate from "./componenets/pariciones/ParicionUpdate";
import Searcher from "./componenets/Searcher";
import ErrorPage from "./ui/ErrorPage";
import VacunasList from "./componenets/vacunas/VacunasList";
import RegisterVacunaForm from "./componenets/vacunas/RegisterVacunaForm";
import UpdaterVacunasForm from "./componenets/vacunas/UpdaterVacunasForm";
import IndexHomeVacunas from "./componenets/vacunas/IndexHomeVacunas";
import PorkVacunar from "./componenets/cerdas/PorkVacunar";
import Vacunar from "./componenets/vacunas/Vacunar";
import VacunarConUnaVacuna from "./componenets/vacunas/VacunarConUnaVacuna";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./componenets/users/Login";
import { ProtectedLayout } from "./ProtectedLayout";
import UsersList from "./componenets/users/UsersList";
import ResetPin from "./componenets/users/ResetPin";
import ResetMyPin from "./componenets/users/ResetMyPin";

const App = () => {
  return (
    <Routes>
      {/* ====================== */}
      {/* RUTAS PÚBLICAS */}
      {/* ====================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-my-pin/:username" element={<ResetMyPin />} />

      {/* ====================== */}
      {/* RUTAS PROTEGIDAS */}
      {/* ====================== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/searcher" element={<Searcher />} />

          {/* Cerdas */}
          <Route path="/pigs" element={<PorkList />} />
          <Route path="/pigs/new" element={<Register />} />
          <Route path="/pigs/:id" element={<PorkDetails />} />
          <Route path="/pigs/update/:id" element={<Updater />} />
          <Route path="/pigs/:id/pariciones" element={<ParicionForm />} />
          <Route path="/pigs/:id/pariciones/update/:paricionId" element={<ParicionUpdate />} />
          <Route path="/pigs/:id/vacunar" element={<PorkVacunar />} />

          {/* Vacunas */}
          <Route path="/vacunas" element={<IndexHomeVacunas />} />
          <Route path="/vacunas/list" element={<VacunasList />} />
          <Route path="/vacunas/register" element={<RegisterVacunaForm />} />
          <Route path="/vacunas/updater/:id" element={<UpdaterVacunasForm />} />
          <Route path="/vacunas/vacunar" element={<Vacunar />} />
          <Route path="/vacunas/vacunar/:vacunaId" element={<VacunarConUnaVacuna />} />

          {/* Users */}
          <Route path="/users/list" element={<UsersList />} />
          
          {/* Resetear PIN por admin */}
          <Route path="/users/reset-pin/:username" element={<ResetPin />} />

          {/* ====================== */}
          {/* ERROR */}
          {/* ====================== */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
