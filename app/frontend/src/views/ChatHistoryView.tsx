import { useMemo } from 'react';

interface Props {
  isLoggedIn: boolean;
}

const ChatHistoryView = ({ isLoggedIn }: Props) => {
  const history = useMemo(
    () => [
      { id: 1, title: 'Onboarding bot', date: '2024-07-01' },
      { id: 2, title: 'Legal doc summary', date: '2024-07-03' }
    ],
    []
  );

  if (!isLoggedIn) {
    return (
      <section className="card">
        <h2>Chat History</h2>
        <p>Login to sync your past conversations from SQLite storage.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Chat History</h2>
      <ul className="chat-history-list">
        {history.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ChatHistoryView;