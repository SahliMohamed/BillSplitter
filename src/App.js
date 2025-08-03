import { useState } from "react"

const initialFriends = [
  {
    id: 118836,
    name: "Drake",
    image: "https://i.pravatar.cc/48?u=499571",
    balance: -7,
  },
  {
    id: 933372,
    name: "Mike",
    image: "https://i.pravatar.cc/48?u=4E9571",
    balance: 20,
  },
  {
    id: 499476,
    name: "Lee",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
]
export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show)
  }
  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend])
    setShowAddFriend(false)
  }
  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    )
    setSelectedFriend(null)
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectedFriend={handleSelectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      <FormSplitBill
        selectedFriend={selectedFriend}
        onSplitBill={handleSplitBill}
      />
    </div>
  )
}
function FriendsList({ friends, selectedFriend, onSelectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          onSelectedFriend={onSelectedFriend}
        />
      ))}
    </ul>
  )
}
function Friend({ friend, selectedFriend, onSelectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id
  return (
    <li key={friend.id} className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button onClick={() => onSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("")
  const [image, setImage] = useState("https://i.pravatar.cc/48")
  function handleSubmit(e) {
    e.preventDefault()
    if (!name || !image) return
    const id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }
    onAddFriend(newFriend)
    setName("")
    setImage("https://i.pravatar.cc/48")
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🫂Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌅Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("")
  const [payedByUser, setPayedByUser] = useState("")
  const paidByFriend = bill ? bill - payedByUser : ""
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  function handleSubmit(e) {
    e.preventDefault()

    if (!bill || !payedByUser) return
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -payedByUser)
  }

  return (
    <>
      {selectedFriend && (
        <form className="form-split-bill" onSubmit={handleSubmit}>
          <h2>Split a bill with {selectedFriend.name}</h2>
          <label>💰 Bill value</label>
          <input
            type="text"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
          />
          <label>🥺 Your expense</label>
          <input
            type="text"
            value={payedByUser}
            onChange={(e) =>
              setPayedByUser(
                Number(e.target.value) > bill
                  ? payedByUser
                  : Number(e.target.value)
              )
            }
          />
          <label>🫂 {selectedFriend.name}'s expense</label>
          <input type="text" disabled value={paidByFriend} />
          <label>🤑 Who is paying the bill?</label>
          <select
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          >
            <option value="user">You</option>
            <option value="friend">{selectedFriend.name}</option>
          </select>
          <Button>Split bill</Button>
        </form>
      )}
    </>
  )
}
