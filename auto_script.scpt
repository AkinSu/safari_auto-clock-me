
  tell application "Safari"
      activate
      make new document
      delay 0.5
      set URL of front document to "https://online.adp.com/signin/v1/?APPID=WFNPortal&productId=80e309c3-7085-bae1-e053-3505430b5495&returnURL=https://workforcenow.adp.com/&callingAppId=WFN&TARGET=-SM-https%3a%2f%2fworkforcenow%2eadp%2ecom%2ftheme%2findex%2ehtml%23/home"
  end tell

  delay 5 -- wait for page to load and password field to be focused

  tell application "System Events"
      tell process "Safari"
          set frontmost to true
          delay 0.5
          keystroke "4UwSuxcZppWil9"
          keystroke return
          delay 5
          keystroke tab
          keystroke tab
          keystroke tab
          keystroke tab
          keystroke tab
          keystroke tab
          delay 0.5
          keystroke return -- press Enter after tabbing 6 times
      end tell
  end tell

  -- delay 1
  -- tell application "Safari"
  --     close front window
  -- end tell
  