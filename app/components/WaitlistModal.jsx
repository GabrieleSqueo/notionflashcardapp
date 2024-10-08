import IframeComponent from './iFrameComponent';

const WaitlistModal = ({ modalId, onClose }) => {
  return (
    <dialog id={modalId} className="modal rounded-xl">
      <div className="modal-box w-full max-w-2xl p-6 relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl border-4 border-purple-400 shadow-2xl">
        <button onClick={onClose} className="absolute top-2 right-2 text-white hover:text-purple-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="font-bold text-3xl sm:text-4xl text-center mb-6 text-white">
          🎉 <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-400">Unlock Your Learning Potential!</span>
        </h3>
        <div className="space-y-6 text-white">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h4 className="text-xl font-bold mb-4 text-yellow-300">🚀 Exclusive Waitlist Benefits:</h4>
            <ul className="list-none space-y-2">
              {[
                ["💎", "50% OFF your first subscription"],
                ["🥇", "Early access to our game-changing tool"],
                ["🎁", "Bonus study resources and tips"],
                ["🔔", "First to know about new features"]
              ].map(([emoji, text]) => (
                <li key={text} className="flex items-center text-base">
                  <span className="text-xl mr-2">{emoji}</span> {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-center text-base">
            Don't let this opportunity slip away! Join now and transform your Notion workspace into a powerful learning engine.
          </p>
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Time is running out!</p>
            <div className="font-bold text-2xl text-yellow-300 animate-pulse" id="countdown">23:59:59</div>
          </div>
        </div>
        <div className="mt-6">
          <IframeComponent />
        </div>
      </div>
    </dialog>
  );
};

export default WaitlistModal;