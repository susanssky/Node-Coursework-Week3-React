import "./App.css";
import Left from "./components/Left";
import Right from "./components/Right";
import { useState, useEffect, useCallback, useRef } from "react";
import Loading from "./components/Loading";
import { bookingType, stateType } from "./utils/types";
import { API_URL } from "./utils/api";

function App() {
  const [bookings, setBookings] = useState<bookingType[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<bookingType[]>([]);
  const [state, setState] = useState<stateType>({
    isLoading: true,
    isError: false,
  });

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}`);
      if (!res.ok) throw Error("Did not receive expected data");
      const data = await res.json();
      setState((prev) => ({ ...prev, isError: false }));
      setBookings(data);
      setFilteredBookings(data);
    } catch (err: any) {
      setState((prev) => ({ ...prev, isError: err.message }));
      console.error(err.message);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <Left
        callData={fetchData}
        bookings={bookings}
        setFilteredBookings={setFilteredBookings}
        scrollToBottom={scrollToBottom}
      />
      {state.isLoading && <Loading />}
      {state.isError && <div className="right-container">{state.isError}</div>}
      {!state.isLoading && !state.isError && (
        <Right
          data={filteredBookings}
          callData={fetchData}
          messagesEndRef={messagesEndRef}
        />
      )}
    </div>
  );
}

export default App;
