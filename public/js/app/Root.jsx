function Root() {
  return (
    <div className="w-full h-screen relative overflow-hidden" style={{background:'var(--cream)'}}>
      <App/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
