import { Button, Col, Image, Row } from "react-bootstrap";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { likePost, removeLikeFromPost } from "../features/posts/postsSlice";
import { AuthContext } from "./AuthProvider";
import UpdatePostModal from "./UpdatePostModal";

export default function ProfilePostCard({ post }) {
  const { content, id: postId, imageUrl } = post;
  const [likes, setLikes] = useState(post.likes || []);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;
  const isLiked = likes.includes(userId);

  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleShowUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {
    setLikes([...likes, userId]);
    dispatch(likePost({ userId, postId }));
  };

  const removeFromLikes = () => {
    setLikes(likes.filter((id) => id !== userId));
    dispatch(removeLikeFromPost({ userId, postId }));
  };

  // useEffect(() => {
  //   fetch(`https://12de56fe-6066-4f67-9c97-3b39be24af16-00-31a0nkx32vpgv.pike.replit.dev/post/${postId}`)
  //   .then((response) => response.json())
  //   .then((data) => setLikes(data.length))
  //   .catch((error) => console.error("Error:", error));
  // }, [postId]);

  return (
    <Row
      className="p-3"
      style={{
        borderTop: "1px solid #D3d3d3",
        borderBottoml: "1px solid #d3d3d3"
      }}
    >
      <Col sm={1}>
        <Image src={pic} fluid roundedCircle />
      </Col>

      <Col>
        <strong>Haris</strong>
        <span> @haris.samingan . Apr 16</span>
        <p>{content}</p>
        <Image src={imageUrl} style={{ width: 150 }} />
        <div className="d-flex justify-content-between">
          <Button variant="light">
            <i className="bi bi-chat"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-repeat"></i>
          </Button>
          <Button variant="light" onCLick={handleLike}>
            {isLiked ? (
              <i className="bi bi-heart-fill text-danger"></i>
            ) : (
              <i className="bi bi-heart"></i>
            )}
            {likes.length}
          </Button>
          <Button variant="light">
            <i className="bi bi-graph-up"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-upload"></i>
          </Button>
          <Button variant="light">
            <i 
              className="bi bi-pencil-square" 
              onClick={handleShowUpdateModal}
            ></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-trash"></i>
          </Button>
          <UpdatePostModal 
            show={showUpdateModal}
            handleClose={handleCloseUpdateModal}
            postId = {postId}
            originalPostContent={content}
          />
        </div>
      </Col>
    </Row>
  )
}