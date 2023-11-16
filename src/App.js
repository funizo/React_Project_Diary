import React, { useState } from "react";
import "./App.css";
import data from "./data";


// 타이틀
function HeadTitle() {
  return (
    <div className="box__layout center">
      <a href='./App.js'><h1>오늘의 일기📖</h1></a>
    </div>
  );
}

// 일기장 입력창
function InputSection({ newDiary, setNewDiary, handleAddDiary }) {
  return (
    <div className="box__layout">
      <div className="title">
        <input
          className="input-style"
          type="text"
          placeholder="제목"
          value={newDiary.title}
          onChange={(e) => setNewDiary({ ...newDiary, title: e.target.value })}
        />
      </div>
      <div className="date">
        <input
          type="date"
          placeholder="날짜"
          value={newDiary.date}
          onChange={(e) => setNewDiary({ ...newDiary, date: e.target.value })}
        />
      </div>
      <div className="inline">
        <label>날씨: </label>
        <select
          value={newDiary.weather}
          onChange={(e) =>
            setNewDiary({ ...newDiary, weather: e.target.value })
          }
        >
          <option value="">선택</option>
          <option value="🌞">🌞</option>
          <option value="⛅">⛅</option>
          <option value="☁️">☁️</option>
          <option value="☔">☔</option>
          <option value="❄️">❄️</option>
          <option value="☃️">☃️</option>
          <option value="⚡">⚡</option>
          <option value="🌈">🌈</option>
        </select>
      </div>
      <div className="feelings">
        <label>기분: </label>
        <select
          value={newDiary.feelings}
          onChange={(e) =>
            setNewDiary({ ...newDiary, feelings: e.target.value })
          }
        >
          <option value="">선택</option>
          <option value="😄">😄</option>
          <option value="😭">😭</option>
          <option value="😠">😠</option>
          <option value="😱">😱</option>
          <option value="😫">😫</option>
          <option value="🤔">🤔</option>
          <option value="😰">😰</option>
          <option value="🫠">🫠</option>
          <option value="🤑">🤑</option>
          <option value="😍">😍</option>
        </select>
      </div>
      <div className="content">
        <textarea
          rows={10}
          className="input-style"
          placeholder="내용"
          value={newDiary.content}
          onChange={(e) =>
            setNewDiary({ ...newDiary, content: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // 기본 Enter 동작을 막아줌 // shift+enter 누르면 줄바뀜
              handleAddDiary(); // 추가 버튼 클릭
            }
          }}
        />
      </div>
      <div className="btn">
        <button onClick={handleAddDiary}>추가</button>
      </div>
    </div>
  );
}

function App() {
  const [diary, setDiary] = useState(data); // 기본값 data.js 파일
  const [modal, setModal] = useState(false); // Modal창 false
  const [selectedDiary, setSelectedDiary] = useState(null); // modal창에서 보여 줄 선택 된 일기 항목

  // 모달창을 띄우는 코드
  const openModal = (diary) => {
    setSelectedDiary(diary);
    setModal(true);
  };

  // 모달창을 닫는 코드
  const closeModal = () => {
    // 버그수정 - 모달창을 띄운 상태에서 삭제를 실행할 시 모달창이 남아있던 버그 수정코드
    setSelectedDiary(null);
    setModal(false);
  };

  // 현재 날짜, 달력
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

  // 복사본을 저장하는 useState / 새로운 일기 항목
  const [newDiary, setNewDiary] = useState({
    title: "",
    date: formattedDate,
    weather: "",
    feelings: "",
    content: "",
  });

  // 일기 항목 입력 후 추가
  // 하나라도 작성이 안되면 추가되지 않음
  const handleAddDiary = () => {
    if (
      newDiary.title &&
      newDiary.date &&
      newDiary.weather &&
      newDiary.feelings &&
      newDiary.content
    ) {
      // 입력값 받은 값을 복사본에 저장
      setDiary([...diary, newDiary]);
      // 초기화
      setNewDiary({
        title: "",
        date: formattedDate,
        weather: "",
        feelings: "",
        content: "",
      });
    } else {
      alert("모든 값을 입력해주세요.");
    }
  };

  // 삭제코드
  const handleDeleteDiary = (index) => {
    // 삭제하고자하는 index 값이 다르면 남기고, 똑같으면 삭제
    const updatedDiary = diary.filter((item, i) => i !== index);
    setDiary(updatedDiary); // 삭제된 항목이 diary에 포함되지 않도록
    closeModal();
  };

  // Modal 컴포넌트
  function Modal(props) {
    const { diary, closeModal } = props;

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>{props.diary.title}</h2>
          <p>날짜: {props.diary.date}</p>
          <p>오늘의 날씨: {props.diary.weather}</p>
          <p>오늘의 기분: {props.diary.feelings}</p>
          <p>{props.diary.content}</p>
          <button onClick={closeModal}>닫기</button>
        </div>
      </div>
    );
  }

  // 목록창 - 제목 클릭하면 나오는 곳
  function Write(props) {
    const { diary, setDelete, openModal } = props;

    // 삭제 시 확인 창이 뜨고, 확인을 눌러야(isConfirmed이 true일 때) 삭제되도록 설정
    const handleDelete = () => {
      const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
      if (isConfirmed) {
        setDelete(diary, () => {
          openModal(null);
        });
      }
    };
    
    // const handleDelete = () => {
    //   setDelete(diary, () => {
    //     openModal(null);
    //   });
    // };

    // 제목 클릭하면 modal창 뜨도록
    return (
      <div className='write'>
        <h2 onClick={() => openModal(diary)}>{props.diary.title}</h2>
        <div className='delete'>
          <button onClick={handleDelete}>삭제</button>
        </div>
      </div>
    );
  }

  // App 컴포넌트 return
  return (
    <div>
      <HeadTitle />
      <div className="box__layout ">
        <InputSection
        // props값 넘기기
          newDiary={newDiary}
          setNewDiary={setNewDiary}
          handleAddDiary={handleAddDiary}
        />
      </div>

      <div className="box__layout">
        {/* 입력값받은 데이터 출력 */}
        {diary.map((a, i) => ( // 요소를 a로, 요소의 인덱스를 i로 받는다
          <div key={i}>
            <span>{diary[i].date + " 일기"}</span>
             {/* 날짜 출력 */}
            <Write
              diary={diary[i]}
              i={i}
              setDelete={() => handleDeleteDiary(i)}
              openModal={() => openModal(diary[i])}
            />
          </div>
        ))}
        {/* 모달창 */}
        {/* 모달 창이 열려있고 선택된 일기 항목이 있는 경우에만 모달 창이 화면에 나타나도록 설정 */}
        {modal && selectedDiary && (
          <Modal diary={selectedDiary} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}

export default App;