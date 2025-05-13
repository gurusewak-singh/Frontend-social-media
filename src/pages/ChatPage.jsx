import React from 'react';

const ChatPage = () => {
  return (
    <div className="flex h-[calc(100vh-150px)] antialiased text-gray-800 w-full"> {/* Adjust height as needed */}
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        {/* Sidebar for chat list */}
        <div className="flex flex-col py-8 pl-6 pr-2 w-1/4 bg-white flex-shrink-0 border-r">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-brand-primary bg-brand-primary/10 h-10 w-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <div className="ml-2 font-bold text-2xl">ChatApp</div>
          </div>
          <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
            {/* Current User Info Placeholder */}
            <div className="h-20 w-20 rounded-full border overflow-hidden bg-gray-300">
              {/* <img src="https://avatar.vercel.sh/YOUR_USERNAME.svg" alt="My Avatar" className="h-full w-full" /> */}
            </div>
            <div className="text-sm font-semibold mt-2">Your Name</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
          {/* Search Bar Placeholder */}
          <div className="mt-4">
             <input type="text" placeholder="Search chats or users..." className="w-full p-2 border border-gray-300 rounded-md text-sm" />
          </div>
          {/* Chat List Placeholder */}
          <div className="flex flex-col mt-4 -mx-2 h-full overflow-y-auto">
            <div className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 cursor-pointer">
              <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">J</div>
              <div className="ml-2 text-sm font-semibold">John Doe</div>
            </div>
            <div className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 cursor-pointer">
              <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">A</div>
              <div className="ml-2 text-sm font-semibold">Alice Smith</div>
              <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded-full leading-none">2</div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            {/* Chat Header Placeholder */}
            <div className="flex items-center justify-between border-b pb-2 mb-4">
                <div className="flex items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-indigo-100">J</div>
                    <div className="ml-3 text-lg font-semibold">John Doe</div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
            </div>
            {/* Messages Area Placeholder */}
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="grid grid-cols-12 gap-y-2">
                {/* Example Sender Message */}
                <div className="col-start-1 col-end-8 p-3 rounded-lg">
                  <div className="flex flex-row items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 text-white">J</div>
                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                      <div>Hey, how are you?</div>
                    </div>
                  </div>
                </div>
                {/* Example Receiver Message */}
                <div className="col-start-6 col-end-13 p-3 rounded-lg">
                  <div className="flex items-center justify-start flex-row-reverse">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-primary flex-shrink-0 text-white">Y</div>
                    <div className="relative mr-3 text-sm bg-brand-primary text-white py-2 px-4 shadow rounded-xl">
                      <div>I'm good, thanks! How about you?</div>
                      <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">Seen</div>
                    </div>
                  </div>
                </div>
                {/* More messages... */}
              </div>
            </div>
            {/* Message Input Placeholder */}
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                </button>
              </div>
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input type="text" className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 text-sm" placeholder="Type your message…" />
                </div>
              </div>
              <div className="ml-4">
                <button className="flex items-center justify-center bg-brand-primary hover:bg-blue-700 rounded-xl text-white px-4 py-1 flex-shrink-0">
                  <span>Send</span>
                  <span className="ml-2">
                    <svg className="w-4 h-4 transform rotate-45 -mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;