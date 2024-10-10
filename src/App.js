import { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showSplitBill, setShowSplitBill] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
    setShowSplitBill(null);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === showSplitBill
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setShowSplitBill(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          onShowAddFriend={setShowAddFriend}
          friends={friends}
          getSplitBill={showSplitBill}
          onShowBill={setShowSplitBill}
        />
        {showAddFriend && (
          <FormAddFriend getFriends={friends} onFriend={setFriends} />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      <FormSplitBill
        getFriends={friends}
        getSplitBill={showSplitBill}
        onSplitBill={handleSplitBill}
        key={showSplitBill}
      />
    </div>
  );
}

function FriendsList({ onShowAddFriend, getSplitBill, onShowBill, friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          onShowAddFriend={onShowAddFriend}
          getSplitBill={getSplitBill}
          onShowBill={onShowBill}
          friend={friend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ onShowAddFriend, friend, getSplitBill, onShowBill }) {
  return (
    <li className={friend.id === getSplitBill ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button
        className="button"
        onClick={() => {
          getSplitBill === friend.id ? onShowBill(null) : onShowBill(friend.id);
          onShowAddFriend(false);
        }}
      >
        {getSplitBill === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ getFriends, onFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function addNewFriend(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onFriend([...getFriends, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend">
      <label>👫 Friend name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => {
          setImage(e.target.value);
        }}
      />

      <Button
        className="button"
        onClick={(e) => {
          addNewFriend(e);
        }}
      >
        Add
      </Button>
    </form>
  );
}

function FormSplitBill({ getFriends, getSplitBill, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [yourExponse, setYourExponse] = useState(0);
  const paidByFriend = bill ? bill - yourExponse : 0;
  const [whoPaying, setWhoPaying] = useState("You");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !yourExponse) return;
    onSplitBill(whoPaying === "You" ? paidByFriend : -yourExponse);
  }

  return getFriends.map((friend, i) =>
    friend.id === getSplitBill ? (
      <form className="form-split-bill" key={i} onSubmit={handleSubmit}>
        <h2>Split a bill with {friend.name}</h2>

        <label>💸Bill value</label>
        <input
          type="number"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />

        <label>🤵Your expenses</label>
        <input
          type="number"
          value={yourExponse}
          onChange={(e) => setYourExponse(Number(e.target.value))}
        />

        <label>👫{friend.name}'s expense</label>
        <input type="number" value={paidByFriend} disabled />

        <label>🤑Who is paying the bill</label>
        <select
          value={whoPaying}
          onChange={(e) => {
            setWhoPaying(e.target.value);
          }}
        >
          <option value="You">You</option>
          <option value="Friend">{friend.name}</option>
        </select>

        <Button className="button">Add</Button>
      </form>
    ) : null
  );
}
