import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import PhotoCard from '../components/PhotoCard';

const Container = styled.View`
  background-color: #fff;
  height: ${Dimensions.get('window').height}px;
`;

const Post = ({ route }) => {
  const [post, setPost] = useState<IPost>();
  const [loading, setLoading] = useState(true);

  const { postId } = route.params;

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      getPost(token as string);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPost = async (token: string) => {
    setLoading(true);
    try {
      const res = await axios(
        `https://api.petgram.club/api/p/individual/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPost(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (
        error.response?.data?.message === 'Missing or malformed JWT' ||
        error.response?.data?.message === 'Invalid or expired JWT'
      ) {
        await AsyncStorage.removeItem('token');
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <>
          <SkeletonPlaceholder speed={1200}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={15}
              marginLeft={15}>
              <SkeletonPlaceholder.Item
                width={45}
                height={45}
                borderRadius={50}
              />
              <SkeletonPlaceholder.Item marginLeft={20}>
                <SkeletonPlaceholder.Item
                  width={120}
                  height={20}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
          <SkeletonPlaceholder speed={1200}>
            <SkeletonPlaceholder.Item width={500} height={300} marginTop={20} />
          </SkeletonPlaceholder>
        </>
      ) : (
        <PhotoCard {...(post as IPost)} />
      )}
    </Container>
  );
};

export default Post;
