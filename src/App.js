import { useState } from "react";
import "./styles.css";

//useInput
const useInput = (initialValue, validator) => {
  // validator 추가
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    let willUpdate = true;
    if (typeof validator === "function") {
      willUpdate = validator(value); // validator 실행
    }
    if (willUpdate) {
      setValue(value);
    }
  };

  return { value, onChange };
};

//useTabs
const content = [
  {
    tab: "Section 1",
    content: "This is the content of the Section 1"
  },
  {
    tab: "Section 2",
    content: "This is the content of the Section 2"
  }
];

//useTabs
const useTabs = (initialTab, allTabs) => {
  const [currentIndex, setCurrentIndex] = useState(initialTab); // useState에 initialTab을 초기값으로 세팅 
  return {
    currentItem: allTabs[currentIndex], // allTabs의 인덱스 값으로 찾은 현재 탭의 정보
    changeItem: setCurrentIndex // 활성화 된 tab
  };
};

//useTitle
const useTitle = iniitialTitle => {
  const [title, setTitle] = useState(iniitialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
};

export default function App() {
  //
  const [item, setItem] = useState(1);
  const incrementItem = () => setItem(item + 1);
  const decrementItem = () => setItem(item - 1);

  //useInput
  const maxLen = (value) => value.length < 10; // maxLen 함수 선언
  const name = useInput("test", maxLen); // maxLen을 args로 전달
  
  //useTabs
  const { currentItem, changeItem } = useTabs(0, content);
  
  //useTitle
  const titleUpdater = useTitle("My React App...");
  setTimeout(() => { // 3초후 titleUpdater 실행
    titleUpdater("home");
  }, 3000);
  
  return (
    <div className="App">
      <h1>Hello {item}</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={incrementItem}>Increment</button>
      <button onClick={decrementItem}>Decrement</button>
      <hr/>
      <input placeholder="name" {...name} />
      <hr/>
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)}>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
      <hr/>
    </div>
  );
}
