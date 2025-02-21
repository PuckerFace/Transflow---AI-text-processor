// // import axios from 'axios';
// import { useState } from 'react';
// import send from '../assets/icons/send.svg';
// import translate from '../assets/icons/translate.svg';
// import summarize from '../assets/icons/summarize.svg';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// const Generator = () => {
//   const [inputText, setInputText] = useState('');
//   const [display, setDisplay] = useState(true);
//   const [displaySummary, setDisplaySummary] = useState(true);
//   const [outputText, setOutputText] = useState([]);
//   const [detectedLanguage, setDetectedLanguage] = useState('');
//   const [summary, setSummary] = useState([]);
//   const [translation, setTranslation] = useState([]);
//   const [selectedLanguage, setSelectedLanguage] = useState('en');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const link = 'https://developer.chrome.com/docs/ai/get-started';

//   const languages = [
//     { code: 'en', name: 'English' },
//     { code: 'pt', name: 'Portuguese' },
//     { code: 'es', name: 'Spanish' },
//     { code: 'ru', name: 'Russian' },
//     { code: 'tr', name: 'Turkish' },
//     { code: 'fr', name: 'French' },
//   ];

//   const handleInputChange = (e) => {
//     setInputText(e.target.value);
//     setError('');
//   };

//   const handleSend = async () => {
//     if (!inputText.trim()) {
//       setError('Input text cannot be empty.');
//       return;
//     }
//     const newOutput = { type: 'original', text: inputText };
//     setOutputText((prevOutputs) => [...prevOutputs, newOutput]);
//     handleLanguage(inputText);
//     setInputText('');
//   };

//   const handleLanguage = async (text) => {
//     const languageDetectorCapabilities =
//       await self.ai.languageDetector.capabilities();
//     const canDetect = languageDetectorCapabilities.available;
//     let detector;
//     if (canDetect === 'no') {
//       setError("The language detector isn't usable.");
//     }
//     if (canDetect === 'readily') {
//       detector = await self.ai.languageDetector.create();
//       const results = await detector.detect(text);
//       setDetectedLanguage(results[0].detectedLanguage);
//       toast.dark(detectedLanguage);
//       console.log(detectedLanguage);
//       setDisplay(false);
//       setError('');
//     } else {
//       detector = await self.ai.languageDetector.create({
//         monitor(m) {
//           m.addEventListener('downloadprogress', (e) => {
//             console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
//           });
//         },
//       });

//     }
//   };

//   const handleSummarize = async () => {
//     if (inputText.length <= 150) {
//       const lastOriginalText = outputText
//         .slice()
//         .reverse()
//         .find((output) => output.type === 'original')?.text;

//       if (!lastOriginalText) {
//         setError('No text available to translate.');
//         return;
//       }
//       try {
//         const capability = await ai.summarizer.capabilities();
//         const available = capability.available;
//         console.log(available);
//         let summarizer;
//         summarizer = await self.ai.summarizer.create();
//         const response = await summarizer.summarize(lastOriginalText);

//         setSummary((prevOutputs) => [
//           ...prevOutputs,
//           {
//             type: 'summary',
//             text: response,
//           },
//         ]);
//         setDisplaySummary(false);
//         setIsLoading(true);
//       } catch (err) {
//         setError('Failed to summarize text.');
//         console.log(err);
//       }
//     }
//     setIsLoading(false);
//   };

//   const handleTranslate = async () => {
//     if (detectedLanguage === selectedLanguage) {
//       setError('Source and target languages cannot be the same.');
//       return;
//     }
//     const lastOriginalText = outputText
//       .slice()
//       .reverse()
//       .find((output) => output.type === 'original')?.text;

//     if (!lastOriginalText) {
//       setError('No text available to translate.');
//       return;
//     }
//     try {
//       const translator = await self.ai.translator.create({
//         sourceLanguage: detectedLanguage,
//         targetLanguage: selectedLanguage,
//       });

//       const response = await translator.translate(lastOriginalText);

//       setTranslation((prevOutputs) => [
//         ...prevOutputs,
//         {
//           type: 'translation',
//           text: response,
//         },
//       ]);
//       setError('');
//       setIsLoading(true);

//       console.log(translation);
//     } catch (err) {
//       setError(`Failed to translate text. `);
//       console.log(err);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div
//       className={`bg-neutral-800 text-white  ${
//         outputText.length > 0 ? 'min-h-screen' : 'h-screen'
//       } w-full  p-4 flex flex-col items-center justify-center font-mono`}
//     >
//       <div className="py-3  border-b-2 border-neutral-700 w-full ">
//         <h1 className="text-5xl text-center mb-3 tracking-widest bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-800 bg-clip-text text-transparent ">
//           Transflow
//         </h1>
//         <h2 className="text-center leading-5 mb-3 text-lg text-neutral-300">
//           AI Text Processor
//         </h2>
//       </div>

//       <div className="flex flex-col w-full h-full p-6   justify-between">
//         <div className="flex flex-col gap-4">
//           {outputText.map((output, index) => (
//             <div
//               key={index}
//               className="mb-3 rounded-2xl border-2 border-neutral-600 p-6 self-end "
//             >
//               <p>{output.text}</p>

//             </div>
//           ))}

//           {outputText.length > 0 && (
//             <div className="self-start  mb-3">
//               <select
//                 value={selectedLanguage}
//                 onChange={(e) => setSelectedLanguage(e.target.value)}
//                 className="bg-neutral-900 "
//               >
//                 {languages.map((lang) => (
//                   <option key={lang.code} value={lang.code}>
//                     {lang.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {translation.map((output, index) => (
//             <div
//               key={index}
//               className="mb-3 rounded-2xl border-2 border-neutral-600 p-4 self-start flex flex-col gap-3"
//             >
//               <p className="border-b border-yellow-500">Translation</p>
//               <p>{output.text}</p>
//             </div>
//           ))}
//           {summary.map((output, index) => (
//             <div
//               key={index}
//               className="mb-3 rounded-2xl border-2 border-neutral-600 p-4 self-start flex flex-col gap-3"
//             >
//               <p className="border-b border-yellow-500">Summary</p>
//               <p>{output.text}</p>
//             </div>
//           ))}
//           {error && (
//             <div className="text-red-500 mb-3 rounded-2xl border-2 border-neutral-600 p-4 self-start flex flex-col gap-3">
//               <p>{error}</p>
//               <a href={link} target="_blank">
//                 Hint:Make sure the api is installed, click to install
//               </a>
//             </div>
//           )}
//           {isLoading && <div>Loading...</div>}
//         </div>
//         <div className=" w-full border-2 border-neutral-600 rounded-2xl flex items-start sm:items-center justify-between p-4 md:p-6 sm:flex-row flex-col outline-yellow-500 ">
//           <textarea
//             value={inputText}
//             onChange={handleInputChange}
//             placeholder="Enter your text here..."
//             aria-label="Input text"
//             className="h-full md:h-[70px] p-4 w-full outline-none resize-none"
//           />
//           <div className="flex items-center justify-start  sm:justify-center mb-3 gap-3">
//             <button
//               onClick={handleSend}
//               aria-label="Send"
//               className="bg-yellow-500 text-white  rounded-full flex items-center justify-center p-3 md:p-4"
//             >
//               <img src={send} alt="send" />
//             </button>
//             <button
//               onClick={handleTranslate}
//               aria-label="translate"
//               className="bg-yellow-500 text-white  rounded-full flex items-center justify-center p-3 md:p-4 disabled:bg-yellow-500/50"
//               disabled={display === true}
//             >
//               <img src={translate} alt="translate" />
//             </button>
//             <button
//               onClick={handleSummarize}
//               aria-label="summarize"
//               className="bg-yellow-500 text-white  rounded-full flex items-center justify-center p-3 md:p-4 disabled:bg-yellow-500/50"
//               disabled={displaySummary === true}
//             >
//               <img src={summarize} alt="summarize" />
//             </button>
//           </div>
//         </div>
//       </div>
//       <ToastContainer hideProgressBar autoClose={1000} position="top-center" />
//     </div>
//   );
// };

// export default Generator;

// import axios from 'axios';
import { useState } from 'react';
import send from '../assets/icons/send.svg';
import translate from '../assets/icons/translate.svg';
import summarize from '../assets/icons/summarize.svg';
const Generator = () => {
  const [inputText, setInputText] = useState('');
  const [display, setDisplay] = useState(true);
  const [displaySummary, setDisplaySummary] = useState(true);
  const [outputText, setOutputText] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [summary, setSummary] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const link = 'https://developer.chrome.com/docs/ai/get-started';

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'es', name: 'Spanish' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'fr', name: 'French' },
  ];

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleSend = async () => {
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }
    const result = await handleLanguage(inputText);

    const newOutput = {
      type: 'original',
      text: inputText,
      detectedLanguage: result,
    };
    setOutputText((prevOutputs) => [...prevOutputs, newOutput]);

    setInputText('');
  };

  const handleLanguage = async (text) => {
    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.available;
    let detector;
    if (canDetect === 'no') {
      setError("The language detector isn't usable.");
    }
    if (canDetect === 'readily') {
      detector = await self.ai.languageDetector.create();
      const results = await detector.detect(text);
      setDisplay(false);
      console.log(detectedLanguage);
      setError('');
      return results[0].detectedLanguage;

      //setDetectedLanguage(results[0].detectedLanguage);
    } else {
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      //await detector.ready;
    }
  };

  const handleSummarize = async () => {
    if (inputText.length >= 150) {
      const lastOriginalText = outputText
        .slice()
        .reverse()
        .find((output) => output.type === 'original')?.text;

      if (!lastOriginalText) {
        setError('No text available to translate.');
        return;
      }
      try {
        const capability = await ai.summarizer.capabilities();
        const available = capability.available;
        console.log(available);
        let summarizer;
        summarizer = await self.ai.summarizer.create();
        const response = await summarizer.summarize(lastOriginalText);

        setSummary((prevOutputs) => [
          ...prevOutputs,
          {
            type: 'summary',
            text: response,
          },
        ]);
        setDisplaySummary(false);
        setIsLoading(true);
      } catch (err) {
        setError('Failed to summarize text.');
        console.log(err);
      }
    }
    setIsLoading(false);
  };

  const handleTranslate = async () => {
    if (detectedLanguage === selectedLanguage) {
      setError('Source and target languages cannot be the same.');
      return;
    }
    const lastOriginalText = outputText
      .slice()
      .reverse()
      .find((output) => output.type === 'original')?.text;

    if (!lastOriginalText) {
      setError('No text available to translate.');
      return;
    }
    try {
      const translator = await self.ai.translator.create({
        sourceLanguage: outputText[0].detectedLanguage,
        targetLanguage: selectedLanguage,
      });

      const response = await translator.translate(lastOriginalText);

      setTranslation((prevOutputs) => [
        ...prevOutputs,
        {
          type: 'translation',
          text: response,
        },
      ]);
      setError('');
      setIsLoading(true);

      console.log(translation);
    } catch (err) {
      setError(`Failed to translate text. `);
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`bg-neutral-800 text-white  ${
        outputText.length > 0 ? 'min-h-screen' : 'h-screen'
      } w-full  p-4 flex flex-col items-center justify-center font-mono`}
    >
      <div className="py-3  border-b-2 border-neutral-700 w-full ">
        <h1 className="text-5xl text-center mb-3 tracking-widest bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-800 bg-clip-text text-transparent ">
          Transflow
        </h1>
        <h2 className="text-center leading-5 mb-3 text-lg text-neutral-300">
          AI Text Processor
        </h2>
      </div>

      <div className="flex flex-col w-full h-full p-6   justify-between">
        <div className="flex flex-col gap-4">
          {outputText.map((output, index) => (
            <div
              key={index}
              className="mb-3 rounded-2xl border-2 border-neutral-600 p-6 self-end "
            >
              <p>{output.text}</p>
              <p className="text-neutral-400">
                {' '}
                Language Detected: {output.detectedLanguage}
              </p>
            </div>
          ))}

          {outputText.length > 0 && (
            <div className="self-start  mb-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-neutral-900 "
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {translation.map((output, index) => (
            <div
              key={index}
              className="mb-3 rounded-2xl border-2 border-neutral-600 p-4 self-start flex flex-col gap-3"
            >
              <p className="border-b border-yellow-500">Translation</p>
              <p>{output.text}</p>
            </div>
          ))}
          {summary.map((output, index) => (
            <div
              key={index}
              className="mb-3 rounded-2xl border-2 border-neutral-600 p-4 self-start flex flex-col gap-3"
            >
              <p className="border-b border-yellow-500">Summary</p>
              <p>{output.text}</p>
            </div>
          ))}
          {error && (
            <div className="text-red-500 mb-3 rounded-2xl border-2 border-neutral-600 p-4 self-start flex flex-col gap-3">
              <p>{error}</p>
              <a href={link} target="_blank">
                Hint:Make sure the api is installed, click to install
              </a>
            </div>
          )}
          {isLoading && <div>Loading...</div>}
        </div>
        <div className=" w-full border-2 border-neutral-600 rounded-2xl flex items-start sm:items-center justify-between p-4 md:p-6 sm:flex-row flex-col outline-yellow-500 ">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter your text here..."
            aria-label="Input text"
            className="h-full md:h-[70px] p-4 w-full outline-none resize-none"
          />
          <div className="flex items-center justify-start  sm:justify-center mb-3 gap-3">
            <button
              onClick={handleSend}
              aria-label="Send"
              className="bg-yellow-500 text-white  rounded-full flex items-center justify-center p-3 md:p-4"
            >
              <img src={send} alt="send" />
            </button>
            <button
              onClick={handleTranslate}
              aria-label="translate"
              className="bg-yellow-500 text-white  rounded-full flex items-center justify-center p-3 md:p-4 disabled:bg-yellow-500/50"
              disabled={display === true}
            >
              <img src={translate} alt="translate" />
            </button>
            <button
              onClick={handleSummarize}
              aria-label="summarize"
              className="bg-yellow-500 text-white  rounded-full flex items-center justify-center p-3 md:p-4 disabled:bg-yellow-500/50"
              disabled={displaySummary === true}
            >
              <img src={summarize} alt="summarize" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
