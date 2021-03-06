import { UserAvatar20 } from '@carbon/icons-react';
import { HeaderGlobalAction } from 'carbon-components-react';
import Avatar from 'react-avatar';
import React, { useCallback, useMemo, useState } from 'react';
import useBus from 'use-bus';

function HeaderUserAction() {
  const [isSignedIn, setIsSignedIn] = useState(gapi.auth2.getAuthInstance().isSignedIn.get());

  useBus(
    'gSignedInChange',
    (data) => {
      setIsSignedIn(data.payload.signedIn);
    },
    []
  );

  const profile = useMemo(() => {
    if (isSignedIn) {
      return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    } else {
      return null;
    }
  }, [isSignedIn]);

  const handleSignIn = useCallback(() => {
    gapi.auth2.getAuthInstance().signIn();
  }, []);

  const handleSignOut = useCallback(() => {
    gapi.auth2.getAuthInstance().signOut();
  }, []);

  if (!isSignedIn) {
    return (
      <HeaderGlobalAction aria-label="Sign In" onClick={handleSignIn}>
        <UserAvatar20 />
      </HeaderGlobalAction>
    );
  } else {
    return (
      <HeaderGlobalAction aria-label="Sign Out" onClick={handleSignOut}>
        <Avatar name={profile!.getName()} src={profile!.getImageUrl()} size="30" round />
      </HeaderGlobalAction>
    );
  }
}

export default React.memo(HeaderUserAction);
