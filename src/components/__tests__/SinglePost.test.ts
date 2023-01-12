import { it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SinglePost from '../post/SinglePost.vue'

it('If props renders properly', () => {
  const wrapper = mount(SinglePost, {
    props: {
      post: {
        body: 'Lorem10 Ipsum',
        id: 1,
        title: 'Ipsum Title not Body',
        userId: 2,
        userName: 'Dalibor',
      }
    }
  })
  expect(wrapper.props().post).toMatchObject({
    body: 'Lorem10 Ipsum',
    id: 1,
    title: 'Ipsum Title not Body',
    userId: 2,
    userName: 'Dalibor',
  });
})

