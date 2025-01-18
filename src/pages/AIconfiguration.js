import React, { useState } from "react";

export default function AIconfiguration() {
  const renderInputField = (label) => (
    <div className="shrink-0 mt-1 h-10 p-2 rounded-xl border border-solid bg-secondary max-md:max-w-full text-left" contentEditable="true"></div>
  );

  const inputs = Array(5).fill(null);
  const [setEditableContent] = useState("");

  return (
    <main className="flex flex-col p-4 rounded-xl md:m-4 max-md:m-1 w-[85%] bg-secondary">
      <header>
        <h1 className="text-2xl leading-7 text-slate-50 max-md:max-w-full">
          Instructions
        </h1>
      </header>
      <section>
        <div
          className="shrink-0 mt-1 p-2 rounded-xl border text-white border-solid bg-secondary border-[color:var(--Practice-Partner-Theme-sys-light-secondary-container,#D2E5F5)] h-[539px] max-md:max-w-full"
          contentEditable="true"
          onInput={(e) => setEditableContent(e.target.textContent)}
        >
          {/* {editableContent} */}
        </div>
      </section>
      <section>
        <h2 className="mt-4 text-2xl leading-7 text-slate-50 max-md:max-w-full">
          Affiliate Recommendations
        </h2>
        <div className="mt-2 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
            <div className="flex flex-col w-[62%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow text-base font-medium leading-6 text-center text-slate-50 max-md:mt-1 max-md:max-w-full">
                <h3 className="max-md:max-w-full">
                  Keywords/phrases triggering prompt
                </h3>
                {inputs.map((_, index) => renderInputField(`${index}`))}
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[19%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow text-base font-medium text-center text-slate-50 max-md:mt-1">
                <h3>Affiliate Name</h3>
                {inputs.map((_, index) => renderInputField(`${index}`))}
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[19%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow text-base font-medium leading-6 text-center text-slate-50 max-md:mt-1">
                <h3>Affiliate Link</h3>
                {inputs.map((_, index) => renderInputField(`${index}`))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="mt-4 text-2xl leading-7 text-slate-50 max-md:max-w-full">
          Conversation Starters
        </h2>
        {inputs.slice(0, 4).map((_, index) => (
  <div
    key={index}
    className="flex gap-4 mt-1 text-2xl bg-secondary leading-8 text-center
   text-blue-100 whitespace-nowrap rounded-xl border border-solid
    border-[color:var(--Practice-Partner-Theme-sys-light-secondary-container,#D2E5F5)]
     max-md:max-w-full"
  >
    <input 
      type="text" 
      className="w-[95%] bg-transparent p-1 rounded-xl"
    />
    <div className="w-px h-10 bg-blue-100"></div>
    <div className="w-[10%] bg-transparent">X</div> 
  </div>
))}

      </section>
      <footer>
        <h2 className="self-start mt-4 text-2xl leading-7 whitespace-nowrap text-slate-50">
          Knowledge Base
        </h2>
        <button className="justify-center items-center px-16 py-3.5 mt-1 max-w-full text-sm font-medium leading-5 text-center border border-solid
         text-blue-100 rounded-xl bg-secondary border-[color:var(--Practice-Partner-Theme-sys-light-secondary-container,#D2E5F5)] w-[218px] max-md:px-5">
          Upload Files
        </button>
      </footer>
    </main>
  );
}
