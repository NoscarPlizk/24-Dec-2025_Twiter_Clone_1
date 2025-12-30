import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Col, Image, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsByUser } from "../features/posts/postsSlice";

export default function ProfileMidBody() {
  // const [posts, setPosts] = useState([]);

  const url = "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const posts = useSelector((store) => store.posts.posts);
  const loading = useSelector((store) => store.posts.loading);
  const dispatch = useDispatch()

  // const fetchPosts = (userId) => {
  //   fetch(`https://12de56fe-6066-4f67-9c97-3b39be24af16-00-31a0nkx32vpgv.pike.replit.dev/posts/user/${userId}`)
  //   .then((response) => response.json())
  //   .then((data) => setPosts(data))
  //   .catch((error) => console.error("Error:", error));
  // };

  useEffect(() => { 
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      // fetchPosts(userId);
      dispatch(fetchPostsByUser(userId));
    }
  }, [dispatch]);

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <Image src={url} fluid/>
      <br />
      <Image 
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: "absolute",
          top: "140px",
          border: "4px solid #F8f9fa",
          marginLeft: 15,
        }}
      />

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button className="rounded-pill mt-2" variant="outline-secondary">
            Edit Profile
          </Button>
        </Col>
      </Row>

      <p className="mt-5" style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}>
        Haris
      </p>
      <p style={{ marginBottom: "2px" }}>@haris.samingan</p>
      <p>I help poople switch careers to be a software developer at sigmaschool.co</p>
      <p>Entrepreneur</p>
      <p>
        <strong>271</strong> Following <strong>610</strong> Followers
      </p>

      <Nav variant="underline" defaultActiveKey="/home" justify>
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/link-1">Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/link-2">Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/link-3">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/link-4">Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      {
        loading && (
        <Spinner className='mt-3 ms-3' variant='primary' 
        animation='border'/>
      )
      }

      {posts.length > 0 && posts.map((post) => (
        <ProfilePostCard key={post.id} 
        content={post.content} postId={post.id} />
      ))}
    </Col>
  );
}