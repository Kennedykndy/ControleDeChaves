/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ScreenType,
  TransitionType,
  UserAccount,
  Employee,
  Environment,
  ActivityLog,
} from "./types";
import {
  INITIAL_EMPLOYEES,
  INITIAL_ENVIRONMENTS,
  INITIAL_LOGS,
} from "./initialData";

import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import DashboardScreen from "./components/DashboardScreen";
import AddEmployeeScreen from "./components/AddEmployeeScreen";
import AddKeyScreen from "./components/AddKeyScreen";
import ReportsScreen from "./components/ReportsScreen";
import EmployeeListScreen from "./components/EmployeeListScreen";
import KeyStatusScreen from "./KeyStatusScreen";

export default function App() {
  // Navigation Routing States
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    return (
      (localStorage.getItem("senac_current_screen") as ScreenType) || "login"
    );
  });
  const [transition, setTransition] = useState<TransitionType>("none");

  // Persistence States
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem("senac_accounts");
    if (saved) return JSON.parse(saved);
    // Prefill with Gmail provided in environment context for personalized experience!
    return [
      {
        fullName: "Prof. Kennedy Cabeseta",
        email: "kennedy.cabeseta@gmail.com",
        registration: "883.102-4",
        password: "123",
      },
    ];
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | undefined>(
    () => {
      const saved = localStorage.getItem("senac_current_user");
      return saved ? JSON.parse(saved) : undefined;
    },
  );

  const [environments, setEnvironments] = useState<Environment[]>(() => {
    const saved = localStorage.getItem("senac_environments");
    return saved ? JSON.parse(saved) : INITIAL_ENVIRONMENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("senac_employees");
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("senac_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem("senac_current_screen", currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    localStorage.setItem("senac_accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("senac_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("senac_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("senac_environments", JSON.stringify(environments));
  }, [environments]);

  useEffect(() => {
    localStorage.setItem("senac_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("senac_logs", JSON.stringify(logs));
  }, [logs]);

  // Transition controller
  const navigateTo = (target: ScreenType, mode: TransitionType = "none") => {
    setTransition(mode);
    setCurrentScreen(target);
  };

  const handleLogout = () => {
    setCurrentUser(undefined);
    navigateTo("login", "push_back");
  };

  // Define Motion Transition animation properties
  const getMotionVariants = () => {
    if (transition === "push") {
      return {
        initial: { x: "100%", opacity: 0.8 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0.8 },
      };
    }
    if (transition === "push_back") {
      return {
        initial: { x: "-100%", opacity: 0.8 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0.8 },
      };
    }
    if (transition === "slide_up") {
      return {
        initial: { y: "100%", opacity: 0.9 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0.9 },
      };
    }
    // none or unknown
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  };

  const motionVariants = getMotionVariants();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f9fe]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={motionVariants.initial}
          animate={motionVariants.animate}
          exit={motionVariants.exit}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="min-h-screen w-full relative"
        >
          {currentScreen === "login" && (
            <LoginScreen
              onNavigate={navigateTo}
              onLoginSuccess={setCurrentUser}
              accounts={accounts}
            />
          )}

          {currentScreen === "register" && (
            <RegisterScreen
              onNavigate={navigateTo}
              onRegisterSuccess={(acc) => setAccounts((prev) => [acc, ...prev])}
            />
          )}

          {currentScreen === "dashboard" && (
            <DashboardScreen
              onNavigate={navigateTo}
              environments={environments}
              setEnvironments={setEnvironments}
              logs={logs}
              setLogs={setLogs}
              currentUser={currentUser}
              onLogout={handleLogout}
              employees={employees}
            />
          )}

          {currentScreen === "add-employee" && (
            <AddEmployeeScreen
              onNavigate={navigateTo}
              employees={employees}
              setEmployees={setEmployees}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === "employees" && (
            <EmployeeListScreen
              onNavigate={navigateTo}
              employees={employees}
              setEmployees={setEmployees}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === "add-key" && (
            <AddKeyScreen
              onNavigate={navigateTo}
              environments={environments}
              setEnvironments={setEnvironments}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === "reports" && (
            <ReportsScreen
              onNavigate={navigateTo}
              environments={environments}
              logs={logs}
              setLogs={setLogs}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === "key-status" && (
  <KeyStatusScreen
    onNavigate={navigateTo}
    environments={environments}
    setEnvironments={setEnvironments}
    logs={logs}
    setLogs={setLogs}
    employees={employees}
    currentUser={currentUser}
    onLogout={handleLogout}
  />
)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
