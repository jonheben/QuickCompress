; NSIS script to add context menu during installation

!macro customInstall
  ; Add context menu entries for JPG files
  WriteRegStr HKCR "SystemFileAssociations\.jpg\shell\QuickCompress" "" "Compress with QuickCompress"
  WriteRegStr HKCR "SystemFileAssociations\.jpg\shell\QuickCompress" "Icon" "$INSTDIR\QuickCompress.exe,0"
  WriteRegStr HKCR "SystemFileAssociations\.jpg\shell\QuickCompress\command" "" '"$INSTDIR\QuickCompress.exe" --compress "%1" --quality 75'

  ; Add context menu entries for JPEG files
  WriteRegStr HKCR "SystemFileAssociations\.jpeg\shell\QuickCompress" "" "Compress with QuickCompress"
  WriteRegStr HKCR "SystemFileAssociations\.jpeg\shell\QuickCompress" "Icon" "$INSTDIR\QuickCompress.exe,0"
  WriteRegStr HKCR "SystemFileAssociations\.jpeg\shell\QuickCompress\command" "" '"$INSTDIR\QuickCompress.exe" --compress "%1" --quality 75'

  ; Add context menu entries for PNG files
  WriteRegStr HKCR "SystemFileAssociations\.png\shell\QuickCompress" "" "Compress with QuickCompress"
  WriteRegStr HKCR "SystemFileAssociations\.png\shell\QuickCompress" "Icon" "$INSTDIR\QuickCompress.exe,0"
  WriteRegStr HKCR "SystemFileAssociations\.png\shell\QuickCompress\command" "" '"$INSTDIR\QuickCompress.exe" --compress "%1" --quality 75'
!macroend

!macro customUnInstall
  ; Remove context menu entries
  DeleteRegKey HKCR "SystemFileAssociations\.jpg\shell\QuickCompress"
  DeleteRegKey HKCR "SystemFileAssociations\.jpeg\shell\QuickCompress"
  DeleteRegKey HKCR "SystemFileAssociations\.png\shell\QuickCompress"
!macroend
