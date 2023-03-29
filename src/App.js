import { useState, useEffect, useRef } from "react";
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
    content: "This is the content of the Section 1",
  },
  {
    tab: "Section 2",
    content: "This is the content of the Section 2",
  },
];

//useTabs
const useTabs = (initialTab, allTabs) => {
  const [currentIndex, setCurrentIndex] = useState(initialTab); // useState에 initialTab을 초기값으로 세팅
  return {
    currentItem: allTabs[currentIndex], // allTabs의 인덱스 값으로 찾은 현재 탭의 정보
    changeItem: setCurrentIndex, // 활성화 된 tab
  };
};

//useTitle
const useTitle = (iniitialTitle) => {
  const [title, setTitle] = useState(iniitialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
};

//useClick
const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    if (typeof onClick === "function") {
      // componentDidMount, componentDidUpdate 일 때 실행하는 부분
      if (element.current) {
        element.current.addEventListener("click", onClick);
      }
    }
    return () => {
      // componentWillUnmount 일 때 실행하는 부분
      if (element.current) {
        element.current.removeEventListener("click", onClick);
      }
    };
  }, []);
  return element;
};

//useConfirm
const useConfirm = (message = "", onConfirm, onCancel) => {
  // message의 기본값은 ""
  if (!onConfirm || typeof onConfirm !== "function") {
    return; // 매개변수 onConfirm가 없거나 onConfirm이 함수가 아나라면 return 실행
  }
  if (onCancel && typeof onCancel !== "function") {
    // onCancle은 필수요소는 아님
    return;
  }
  const confirmAction = () => {
    // confirm창의 응답에 따른 이벤트 실행 함수
    if (confirm(message)) {
      // 확인을 눌렀다면
      onConfirm();
    } else {
      // 취소를 눌렀다면
      onCancel();
    }
  };
  return confirmAction;
};

//usePreventLeave
const usePreventLeave = () => {
  const listener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };
  const enablePrevent = () => window.addEventListener("beforeunload", listener); // beforeunload 이벤트 리스너로 listener 지정
  const disablePrevent = () =>
    window.removeEventListener("beforeunload", listener); // beforeunload 이벤트 제거
  return { enablePrevent, disablePrevent }; // 두 함수를 return
};

//useBeforeLeave
const useBeforeLeave = onBefore => {
  if (typeof onBefore !== "function") {
    return;
  }
  const handle = event => {
    const { clientY } = event; // event : MouseEvent의 객체
    if (clientY <= 0) { // clientY(마우스의 좌표값)가 0 이하
      onBefore();
    }
  };
  useEffect(() => { 
    document.addEventListener("mouseleave", handle); // 컴포넌트가 mount 되면, mouseleave 이벤트 생성
    return () => document.removeEventListener("mouseleave", handle); // 컴포넌트가 unmount 되면, mouseleave 이벤트 제거
  }, []); // 이벤트가 document에 추가 되는 것을 막음(한번만 실행)
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
  setTimeout(() => {
    // 3초후 titleUpdater 실행
    titleUpdater("home");
  }, 3000);

  //useCLick
  const sayHello = () => console.log("sayHello");
  const h1Element = useClick(sayHello);

  //useConfirm
  const deleteWorld = () => console.log("delete"); // 확인 눌렀을 때 실행할 함수
  const abortWorld = () => console.log("Aborted"); // 취소 눌렀을 때 실행할 함수
  const conformDelete = useConfirm("Are you sure?", deleteWorld, abortWorld);

  //usePreventLeave
  const { enablePrevent, disablePrevent } = usePreventLeave();
  
  //useBeforeLeave
  const dontLeave = () => console.log("Pls dont leave");
  useBeforeLeave(dontLeave);

  return (
    <div className="App">
      <h1>Hello {item}</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={incrementItem}>Increment</button>
      <button onClick={decrementItem}>Decrement</button>
      <hr />
      <input placeholder="name" {...name} />
      <hr />
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)}>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
      <hr />
      <h1 ref={h1Element}>Hi</h1>
      <hr />
      <button onClick={conformDelete}>Delete the world</button>
      <hr />
      <button onClick={enablePrevent}>Protect</button>
      <button onClick={disablePrevent}>Unprotect</button>
    </div>
  );
}
