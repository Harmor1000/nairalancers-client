export const INITIAL_STATE = {
    userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
    title: "",
    cat: "",
    subcategory: "",
    cover: "",
    images: [],
    desc: "",
    shortTitle: "",
    shortDesc: "",
    deliveryTime: '',
    revisionNumber: '',
    features: [],
    price: '',
    
    // Package System
    hasPackages: false,
    packages: {
        basic: {
            enabled: false,
            title: "",
            description: "",
            price: '',
            deliveryTime: '',
            revisions: '',
            features: []
        },
        standard: {
            enabled: false,
            title: "",
            description: "",
            price: '',
            deliveryTime: '',
            revisions: '',
            features: []
        },
        premium: {
            enabled: false,
            title: "",
            description: "",
            price: '',
            deliveryTime: '',
            revisions: '',
            features: []
        }
    },
    
    // Milestone System
    hasMilestones: false,
    milestones: []
}

export const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload
        ),
      };
    case "RESET_STATE":
      return {
        ...INITIAL_STATE,
        ...action.payload,
      };
    
    case "TOGGLE_PACKAGES":
      return {
        ...state,
        hasPackages: action.payload,
        hasMilestones: action.payload ? false : state.hasMilestones,
        milestones: action.payload ? [] : state.milestones,
        packages: action.payload ? state.packages : {
          basic: { enabled: false, title: "", description: "", price: 0, deliveryTime: 0, revisions: 0, features: [] },
          standard: { enabled: false, title: "", description: "", price: 0, deliveryTime: 0, revisions: 0, features: [] },
          premium: { enabled: false, title: "", description: "", price: 0, deliveryTime: 0, revisions: 0, features: [] }
        }
      };
    
    case "UPDATE_PACKAGE":
      return {
        ...state,
        packages: {
          ...state.packages,
          [action.payload.packageType]: {
            ...state.packages[action.payload.packageType],
            [action.payload.field]: action.payload.value
          }
        }
      };
    
    case "ADD_PACKAGE_FEATURE":
      return {
        ...state,
        packages: {
          ...state.packages,
          [action.payload.packageType]: {
            ...state.packages[action.payload.packageType],
            features: [...state.packages[action.payload.packageType].features, action.payload.feature]
          }
        }
      };
    
    case "REMOVE_PACKAGE_FEATURE":
      return {
        ...state,
        packages: {
          ...state.packages,
          [action.payload.packageType]: {
            ...state.packages[action.payload.packageType],
            features: state.packages[action.payload.packageType].features.filter(
              (feature, index) => index !== action.payload.index
            )
          }
        }
      };
    
    case "TOGGLE_MILESTONES":
      return {
        ...state,
        hasMilestones: action.payload,
        hasPackages: action.payload ? false : state.hasPackages,
        packages: action.payload ? {
          basic: { enabled: false, title: "", description: "", price: '', deliveryTime: '', revisions: '', features: [] },
          standard: { enabled: false, title: "", description: "", price: '', deliveryTime: '', revisions: '', features: [] },
          premium: { enabled: false, title: "", description: "", price: '', deliveryTime: '', revisions: '', features: [] }
        } : state.packages,
        milestones: action.payload ? state.milestones : []
      };
    
    case "ADD_MILESTONE":
      return {
        ...state,
        milestones: [...state.milestones, {
          title: "",
          description: "",
          price: '',
          deliveryTime: '',
          order: state.milestones.length + 1
        }]
      };
    
    case "UPDATE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones.map((milestone, index) =>
          index === action.payload.index
            ? { ...milestone, [action.payload.field]: action.payload.value }
            : milestone
        )
      };
    
    case "REMOVE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones
          .filter((_, index) => index !== action.payload.index)
          .map((milestone, index) => ({ ...milestone, order: index + 1 }))
      };

    default:
      return state;
  }
};