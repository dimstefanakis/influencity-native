/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Keyboard,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Avatar,
  TextInput,
  Button,
  Subheading,
  Text,
  useTheme,
} from 'react-native-paper';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {getPosts, resetFeedPosts} from '../posts/postsSlice';
import useKeyboardOpen from '../../hooks/useKeyboardOpen';
const {width: screenWidth} = Dimensions.get('window');

function ChainedPostsCarousel({route}) {
  const dispatch = useDispatch();
  const carouselRef = useRef();
  const currentPost = route.params?.currentPost;
  const isComment = route.params?.isComment;
  const {token} = useSelector((state) => state.authentication);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    {
      index: 0,
      text: '',
      images: [],
      videos: [],
      linked_project: null,
    },
  ]);
  const [postButtonActive, setPostButtonActive] = useState(false);

  async function handleCreatePosts(selectedTiers, setLoading) {
    let newPostIds = [];
    let createdPosts = [];
    // first create each post separetaly
    for await (let post of posts) {
      if (!(post.text || post.images.length > 0 || post.videos.length > 0)) {
        continue;
      }
      let imageData = post.images.map((i) => {
        console.log(i);
        const path = i.path.split('/');
        return {
          name: 'images',
          filename: path[path.length - 1],
          type: i.mime,
          data: RNFetchBlob.wrap(i.path),
        };
      });
      try {
        let url = Config.API_URL + '/v1/posts/';
        setLoading(true);

        const postData = [
          ...imageData,
          {name: 'text', data: post.text},
          // TODO
          // since videos are directly uploaded to mux and have no initial attachment to the backend until some processing happens
          // we are notifying backend if the post has videos or not
          // we should later fix this so that backend discovers the initial state on its own

          {name: 'has_videos', data: (post.videos.length > 0).toString()},
          {name: 'tier', data: selectedTiers[0].toString()}, // without toString backend receives empty data

          // adding this for legacy purposes
          {name: 'tiers', data: selectedTiers[0].toString()}, // without toString backend receives empty data
        ];
        if (post.linked_project) {
          postData.push({name: 'linked_project', data: post.linked_project});
        }

        await RNFetchBlob.fetch(
          'POST',
          url,
          {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token,
          },
          postData,
        )
          .then(async (response) => {
            console.log(response, 'response');
            let data = JSON.parse(response.data);
            let {id} = data;
            createdPosts.push(data);
            if (post.videos.length > 0) {
              await handleCreateVideo(data, post.videos);
            }
            newPostIds.push(id);
            setLoading(false);
          })
          .catch((e) => {
            console.error(e, 'error');
            setLoading(false);
          });
        dispatch(resetFeedPosts());
        dispatch(getPosts({endpoint: `${Config.API_URL}/v1/new_posts/`}));
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    // then chain them all together
    // doing this until a new endpoint is added which handle everything at once
    if (posts.length > 1) {
      try {
        let url = Config.API_URL + '/v1/chain_posts/';
        let formData = new FormData();
        formData.append('post_ids', JSON.stringify(newPostIds));
        let response = await axios.post(url, formData);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      let url = Config.API_URL + `/v1/posts/${createdPosts[0].id}/`;
      let response = await axios.get(url);
      navigation.navigate('PostScreen', {post: response.data});
    } catch (e) {
      console.error(e);
    }
    /*let previewPost = createdPosts[0];
    previewPost.chained_posts = createdPosts.slice(1, createdPosts.length);
    navigation.navigate('PostScreen', {post: previewPost});*/
  }

  async function handleCreateVideo(post, postVideos) {
    try {
      const videos = postVideos;
      // const data = videos.map((vid) => RNFetchBlob.wrap(vid.path));

      // get mux upload url with the secret key found through our backend endpoint
      let url = Config.API_URL + '/v1/upload_video/';
      let formData = new FormData();
      formData.append('post', post.id);

      for await (let video of videos) {
        const data = RNFetchBlob.wrap(video.path);
        // upload to the mux upload url
        let response = await axios.post(url, formData);
        let uploadUrl = response.data.url;
        await RNFetchBlob.fetch(
          'PUT',
          uploadUrl,
          null, // {'Content-Type': 'application/octet-stream'},
          data,
        )
          .then((r) => {
            console.log(r, 'response');
          })
          .catch((e) => {
            console.error(e, 'error');
          });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleSelectTier() {
    navigation.navigate('SelectTierScreen', {
      handleCreateItems: handleCreatePosts,
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handleSelectTier /*handleCreatePosts*/}
          mode="contained"
          labelStyle={{color: 'black'}}
          disabled={!postButtonActive}
          style={{marginRight: 10, borderRadius: 100}}>
          Post
        </Button>
      ),
    });
  }, [navigation, posts, handleCreatePosts]);

  function renderItem({item, index}) {
    return (
      <PostEditor
        post={item}
        index={index}
        posts={posts}
        setPosts={setPosts}
        isComment={isComment}
        carouselRef={carouselRef}
        setPostButtonActive={setPostButtonActive}
      />
    );
  }

  return (
    <Carousel
      sliderWidth={screenWidth}
      sliderHeight={screenWidth}
      itemWidth={screenWidth}
      data={posts}
      renderItem={renderItem}
      ref={carouselRef}
    />
  );
}

function PostEditor({
  post,
  posts,
  setPosts,
  index,
  isComment,
  setPostButtonActive,
  carouselRef,
}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const isKeyboardVisible = useKeyboardOpen();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [fileData, setData] = useState('');
  const [attachedProject, setAttachedProject] = useState(null);
  // used for dynamically allocating height to the text input component
  const [textInputMarginBottom, setTextInputMarginBottom] = useState(80);

  function buttonActive(_posts) {
    return _posts.some((_post) => {
      return _post.text || _post.images.length > 0 || _post.videos.length > 0;
    });
  }

  function handleChangeText(value) {
    let _post = post;
    _post.text = value;
    setPosts((oldPosts) => {
      let foundIndex = oldPosts.findIndex((element) => element.index === index);
      oldPosts[foundIndex] = _post;
      setPostButtonActive(buttonActive(oldPosts));
      return oldPosts;
    });
    //setText(value);
  }

  function handleSelectImages() {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    }).then((results) => {
      console.log(results);
      setImages(results); // delete later
      let data = '';
      RNFetchBlob.fs
        .readStream(
          // file path
          results[0].path,
          // encoding, should be one of `base64`, `utf8`, `ascii`
          'base64',
          // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
          // when reading file in BASE64 encoding, buffer size must be multiples of 3.
          4095,
        )
        .then((ifstream) => {
          ifstream.open();
          ifstream.onData((chunk) => {
            // when encoding is `ascii`, chunk will be an array contains numbers
            // otherwise it will be a string
            data += chunk;
          });
          ifstream.onError((err) => {
            console.log('oops', err);
          });
          ifstream.onEnd(() => {
            setData(data);
          });
        });

      let _post = post;
      results.forEach((result) => {
        if (result.mime.includes('image')) {
          _post.images.push(result);
        } else if (result.mime.includes('video')) {
          _post.videos.push(result);
        }
      });

      setPosts((oldPosts) => {
        let foundIndex = oldPosts.findIndex(
          (element) => element.index === index,
        );
        oldPosts[foundIndex] = _post;
        setPostButtonActive(buttonActive(oldPosts));
        return oldPosts;
      });
      //setImages([...images, ...results]);
    });
  }

  function chainNewPost() {
    setPosts((oldPosts) => {
      const lastIndex = oldPosts[oldPosts.length - 1].index;
      return [
        ...oldPosts,
        {
          index: lastIndex + 1,
          text: '',
          images: [],
          videos: [],
          linked_project: null,
        },
      ];
    });

    // lazy fix
    // just delay this a bit until state get updated then snap to next
    setTimeout(() => {
      carouselRef.current.snapToNext();
    }, 500);
  }

  function handleAttachProjectPress() {
    navigation.navigate('MyCreatedProjectsScreen', {
      handleSelectProject: (project) => {
        setAttachedProject(project);
      },
    });
  }

  function handleOnLayout(event) {
    const {x, y, width, height} = event.nativeEvent.layout;
    setTextInputMarginBottom(height);
  }

  useEffect(() => {
    // update post with the corresponding attached project
    if (attachedProject) {
      setPosts((oldPosts) => {
        let _post = post;
        _post.linked_project = attachedProject.id;
        let foundIndex = oldPosts.findIndex(
          (element) => element.index === index,
        );
        oldPosts[foundIndex] = _post;
        setPostButtonActive(buttonActive(oldPosts));
        return oldPosts;
      });
    }
  }, [attachedProject]);

  console.log(post);
  return (
    <View
      contentContainerStyle={{
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '100%',
        height: '100%',
      }}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '100%',
        height: '100%',

        width: '100%',
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          backgroundColor: theme.colors.background,
          width: '100%',
          // this fixes a bug where text input would lose focus when keyboard was open
          marginTop: 40,
        }}>
        <TextInput
          style={{
            backgroundColor: theme.colors.background,
            marginBottom: textInputMarginBottom,
          }}
          multiline
          mode="flat"
          label="Post your knowledge"
          underlineColor="transparent"
          onChangeText={handleChangeText}
        />
      </View>
      <View
        onLayout={handleOnLayout}
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          zIndex: 200000,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
          }}>
          {post.videos.map((vid) => {
            return (
              <Video
                source={{
                  uri: vid.path,
                  type: 'm3u8',
                }}
                resizeMode="cover"
                style={{
                  height: 100,
                  width: 100,
                  borderColor: '#f9f9f9',
                  borderWidth: 1,
                  borderRadius: 15,
                }}
              />
            );
          })}
          {post.images.map((im) => {
            return (
              <Image
                source={{uri: im.path}}
                style={{
                  height: 100,
                  width: 100,
                  borderColor: '#f9f9f9',
                  borderWidth: 1,
                  borderRadius: 15,
                }}
              />
            );
          })}
        </View>
        <View>
          {attachedProject ? (
            <View
              style={{
                width: '100%',
                padding: 10,
                backgroundColor: theme.colors.background,
              }}>
              <Text style={{fontSize: 20, ...theme.fonts.medium}}>
                Attached project
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    backgroundColor: '#f7f7f9',
                    borderRadius: 100,
                  }}
                  onPress={() => setAttachedProject(null)}>
                  <Icon size={14} name="close" color="gray" />
                </TouchableOpacity>
                <Avatar.Icon
                  size={30}
                  icon="code-tags"
                  color="white"
                  style={{marginLeft: 5}}
                />
                <Text style={{marginLeft: 5, ...theme.fonts.medium}}>
                  {attachedProject.name}
                </Text>
              </View>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              height: 80,
            }}>
            <TouchableNativeFeedback onPress={handleSelectImages}>
              <View
                style={{
                  width: '33%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon size={24} name="camera-outline" />
                <Subheading style={{fontSize: 12}}>Add media</Subheading>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={chainNewPost}>
              <View
                style={{
                  width: '33%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon size={24} name="link-variant" />
                <Subheading style={{fontSize: 12}}>Chain posts</Subheading>
              </View>
            </TouchableNativeFeedback>
            {isComment ? null : (
              <TouchableNativeFeedback onPress={handleAttachProjectPress}>
                <View
                  style={{
                    width: '33%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign size={24} name="rocket1" />
                  <Subheading style={{fontSize: 12}}>Attach project</Subheading>
                </View>
              </TouchableNativeFeedback>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default ChainedPostsCarousel;
