import { API_URL } from "../../lib/constants"

const Me = () => {
  return (
    <div>
      <img src={`${API_URL}/profile/pfp`} />
    </div>
  )
}

export default Me
