import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rootlayout from "@/pages/layout.tsx";
import "./index.css";
import App from "./App.tsx";
import SignUp from "./pages/auth/sign-up.tsx";
import SignIn from "./pages/auth/sign-in.tsx";
import MyPage from "./pages/my page/MyPage.tsx";
import MyPageEdit from "./pages/my page/MyPageEdit.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Rootlayout />}>
          <Route path="/" element={<App />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/my-page/edit" element={<MyPageEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
