import { mount, shallow } from "enzyme";
import App from "../App";
import toJson from 'enzyme-to-json'

// Source: https://circleci.com/blog/continuously-testing-react-applications-with-jest-and-enzyme/
describe('App component rendering', () => {
    it('renders without crashing given the required props', () => {
        const props = {
            isFetching: false,
            dispatch: jest.fn(),
            posts: []
        }
        const wrapper = shallow(<App {...props} />)
        expect(toJson(wrapper)).toMatchSnapshot()
    })
})

describe('ContextProvider', () => {
    it('sets the userData prop as the value.userData prop on the ContextProvider and expects values to be equal', () => {
        const props = {
            userData: {
                "token": undefined,
                "user": undefined,
            },
        }

        const wrapper = shallow(<App {...props} />); // shallow render component and pass props
        const UserContextProvider = wrapper.find('ContextProvider'); // Find ContextProvider component in snapshot

        // Strictly expects passed prop userData to be the same as provider's userData
        expect(UserContextProvider.props().value.userData).toStrictEqual(props.userData); 
    })
})