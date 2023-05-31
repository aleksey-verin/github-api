import { toast } from 'react-hot-toast';

export const showNoteSearchRequest = (
  promise: Promise<unknown>,
  resolveFunc: void,
  rejectFunc: void,
  value: string
) => {
  toast.promise(
    promise,
    {
      loading: 'Searching..',
      success: () => {
        resolveFunc;
        return `Search "${value}" completed!`;
      },
      error: () => {
        rejectFunc;
        return 'Search error. The limit of requests to the server per minute has been exceeded. Try again later';
      }
    },
    {
      success: {
        duration: 1000
      },
      error: {
        duration: 3000,
        icon: '😢'
      }
    }
  );
};

export const showNoteLoginForGraphRequest = () => {
  toast(
    "Please log in to the app or change the request type to 'REST API' 😔\n\nWithout authorization, you cannot use the search if you have selected the 'GraphQl' query type in the settings.",
    {
      duration: 3000
    }
  );
};

export const showNoteSameWordForSearch = () => {
  toast('The same request. Enter another word', {
    duration: 1000
  });
};

export const showNoteLogin = (promise: Promise<unknown>) => {
  toast.promise(
    promise,
    {
      loading: 'Please wait..',
      success: 'You have successfully logged in to the app',
      error: 'Something went wrong with authorization'
    },
    {
      success: {
        duration: 3000,
        icon: '🔥'
      },
      error: {
        duration: 3000,
        icon: '😢'
      }
    }
  );
};

export const showNoteSaveParams = (promise: Promise<unknown>) => {
  toast.promise(
    promise,
    {
      loading: 'Please wait..',
      success: 'Successfully saved!',
      error: 'Something went wrong request'
    },
    {
      success: {
        duration: 1000,
        icon: '🔥'
      },
      error: {
        duration: 1000,
        icon: '😢'
      }
    }
  );
};
