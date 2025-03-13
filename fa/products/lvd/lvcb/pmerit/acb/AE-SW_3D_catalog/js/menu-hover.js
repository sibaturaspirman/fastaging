/* jshint strict: false */



//menu マウスオーバー画像切り替え
//-----01--------------------------------------------------------------------
$(function() {
  //画像にマウスを乗せたら発動
  $('.hyoji_ProductFeaturers').hover(function() {
    //画像のsrc属性が別画像のパスに切り替わる
    $('.hyoji_ProductFeaturers-2 img').attr('src', 'images/01_ProductFeaturers_on.png');
  //マウスを離したときの動作
  }, function() {
    //画像のsrc属性を元の画像のパスに戻す
    $('.hyoji_ProductFeaturers-2 img').attr('src', 'images/01_ProductFeaturers_off.png');
  });
});

//-----02------------------------------------------------------------------------
$(function() {
  $('.hyoji_HorizontalTerminal').hover(function() {
    $('.hyoji_HorizontalTerminal-2 img').attr('src', 'images/02_HorizontalTerminal_on.png');
  }, function() {
    $('.hyoji_HorizontalTerminal-2 img').attr('src', 'images/02_HorizontalTerminal_off.png');
  });
});
$(function() {
  $('.hyoji_VerticalTerminal').hover(function() {
    $('.hyoji_VerticalTerminal-2 img').attr('src', 'images/02_VerticalTerminal_on.png');
  }, function() {
    $('.hyoji_VerticalTerminal-2 img').attr('src', 'images/02_VerticalTerminal_off.png');
  });
});
$(function() {
  $('.hyoji_FrontTerminal').hover(function() {
    $('.hyoji_FrontTerminal-2 img').attr('src', 'images/02_FrontTerminal_on.png');
  }, function() {
    $('.hyoji_FrontTerminal-2 img').attr('src', 'images/02_FrontTerminal_off.png');
  });
});

$(function() {
  $('.hyoji_VerticalTerminalAdapter').hover(function() {
    $('.hyoji_VerticalTerminalAdapter-2 img').attr('src', 'images/02_VerticalTerminalAdapter_on.png');
  }, function() {
    $('.hyoji_VerticalTerminalAdapter-2 img').attr('src', 'images/02_VerticalTerminalAdapter_off.png');
  });
});
$(function() {
  $('.hyoji_FrontTerminalAdapter').hover(function() {
    $('.hyoji_FrontTerminalAdapter-2 img').attr('src', 'images/02_FrontTerminalAdapter_on.png');
  }, function() {
    $('.hyoji_FrontTerminalAdapter-2 img').attr('src', 'images/02_FrontTerminalAdapter_off.png');
  });
});

//-----03-----------------------------------------------------------------
$(function() {
  $('.hyoji_IntegratedTripUnit-DP3').hover(function() {
    $('.hyoji_IntegratedTripUnit-DP3-2 img').attr('src', 'images/03_IntegratedTripUnit_on.png');
  }, function() {
    $('.hyoji_IntegratedTripUnit-DP3-2 img').attr('src', 'images/03_IntegratedTripUnit_off.png');
  });
});
$(function() {
  $('.hyoji_ModularTripUnit').hover(function() {
    $('.hyoji_ModularTripUnit-2 img').attr('src', 'images/03_ModularTripUnit_on.png');
  }, function() {
    $('.hyoji_ModularTripUnit-2 img').attr('src', 'images/03_ModularTripUnit_off.png');
  });
});
$(function() {
  $('.hyoji_WS').hover(function() {
    $('.hyoji_WS-2 img').attr('src', 'images/03_WS_on.png');
  }, function() {
    $('.hyoji_WS-2 img').attr('src', 'images/03_WS_off.png');
  });
});
$(function() {
  $('.hyoji_WM').hover(function() {
    $('.hyoji_WM-2 img').attr('src', 'images/03_WM_on.png');
  }, function() {
    $('.hyoji_WM-2 img').attr('src', 'images/03_WM_off.png');
  });
});
$(function() {
  $('.hyoji_WB').hover(function() {
    $('.hyoji_WB-2 img').attr('src', 'images/03_WB_on.png');
  }, function() {
    $('.hyoji_WB-2 img').attr('src', 'images/03_WB_off.png');
  });
});
$(function() {
  $('.hyoji_WF').hover(function() {
    $('.hyoji_WF-2 img').attr('src', 'images/03_WF_on.png');
  }, function() {
    $('.hyoji_WF-2 img').attr('src', 'images/03_WF_off.png');
  });
});
$(function() {
  $('.hyoji_G1').hover(function() {
    $('.hyoji_G1-2 img').attr('src', 'images/03_G1_on.png');
  }, function() {
    $('.hyoji_G1-2 img').attr('src', 'images/03_G1_off.png');
  });
});
$(function() {
  $('.hyoji_E1').hover(function() {
    $('.hyoji_E1-2 img').attr('src', 'images/03_E1_on.png');
  }, function() {
    $('.hyoji_E1-2 img').attr('src', 'images/03_E1_off.png');
  });
});
$(function() {
  $('.hyoji_AP').hover(function() {
    $('.hyoji_AP-2 img').attr('src', 'images/03_AP_on.png');
  }, function() {
    $('.hyoji_AP-2 img').attr('src', 'images/03_AP_off.png');
  });
});
$(function() {
  $('.hyoji_N5').hover(function() {
    $('.hyoji_N5-2 img').attr('src', 'images/03_N5_on.png');
  }, function() {
    $('.hyoji_N5-2 img').attr('src', 'images/03_N5_off.png');
  });
});
$(function() {
  $('.hyoji_P1').hover(function() {
    $('.hyoji_P1-2 img').attr('src', 'images/03_P1_on.png');
  }, function() {
    $('.hyoji_P1-2 img').attr('src', 'images/03_P1_off.png');
  });
});
$(function() {
  $('.hyoji_P2').hover(function() {
    $('.hyoji_P2-2 img').attr('src', 'images/03_P2_on.png');
  }, function() {
    $('.hyoji_P2-2 img').attr('src', 'images/03_P2_off.png');
  });
});
$(function() {
  $('.hyoji_P3').hover(function() {
    $('.hyoji_P3-2 img').attr('src', 'images/03_P3_on.png');
  }, function() {
    $('.hyoji_P3-2 img').attr('src', 'images/03_P3_off.png');
  });
});
$(function() {
  $('.hyoji_P4').hover(function() {
    $('.hyoji_P4-2 img').attr('src', 'images/03_P4_on.png');
  }, function() {
    $('.hyoji_P4-2 img').attr('src', 'images/03_P4_off.png');
  });
});
$(function() {
  $('.hyoji_P5').hover(function() {
    $('.hyoji_P5-2 img').attr('src', 'images/03_P5_on.png');
  }, function() {
    $('.hyoji_P5-2 img').attr('src', 'images/03_P5_off.png');
  });
});
$(function() {
  $('.hyoji_TripUnitDisplay-DP1').hover(function() {
    $('.hyoji_TripUnitDisplay-DP1-2 img').attr('src', 'images/03_TripUnitDisplay-DP1_on.png');
  }, function() {
    $('.hyoji_TripUnitDisplay-DP1-2 img').attr('src', 'images/03_TripUnitDisplay-DP1_off.png');
  });
});
$(function() {
  $('.hyoji_PanelBoardDisplay-DP2').hover(function() {
    $('.hyoji_PanelBoardDisplay-DP2-2 img').attr('src', 'images/03_PanelBoardDisplay-DP2_on.png');
  }, function() {
    $('.hyoji_PanelBoardDisplay-DP2-2 img').attr('src', 'images/03_PanelBoardDisplay-DP2_off.png');
  });
});
$(function() {
  $('.hyoji_ExtensionModule-EX1').hover(function() {
    $('.hyoji_ExtensionModule-EX1-2 img').attr('src', 'images/03_ExtensionModule_on.png');
  }, function() {
    $('.hyoji_ExtensionModule-EX1-2 img').attr('src', 'images/03_ExtensionModule_off.png');
  });
});
$(function() {
  $('.hyoji_VTunit').hover(function() {
    $('.hyoji_VTunit-2 img').attr('src', 'images/03_VTunit_on.png');
  }, function() {
    $('.hyoji_VTunit-2 img').attr('src', 'images/03_VTunit_off.png');
  });
});
$(function() {
  $('.hyoji_MakingCurrentReleaseSwitch').hover(function() {
    $('.hyoji_MakingCurrentReleaseSwitch-2 img').attr('src', 'images/03_MakingCurrentReleaseSwitch_on.png');
  }, function() {
    $('.hyoji_MakingCurrentReleaseSwitch-2 img').attr('src', 'images/03_MakingCurrentReleaseSwitch_off.png');
  });
});
$(function() {
  $('.hyoji_TemperatureAlarm').hover(function() {
    $('.hyoji_TemperatureAlarm-2 img').attr('src', 'images/03_TemperatureAlarm_on.png');
  }, function() {
    $('.hyoji_TemperatureAlarm-2 img').attr('src', 'images/03_TemperatureAlarm_off.png');
  });
});

//-----04-----------------------------------------------------------------
$(function() {
  $('.hyoji_FieldTestDevice').hover(function() {
    $('.hyoji_FieldTestDevice-2 img').attr('src', 'images/04_FieldTestDevice_on.png');
  }, function() {
    $('.hyoji_FieldTestDevice-2 img').attr('src', 'images/04_FieldTestDevice_off.png');
  });
});
$(function() {
  $('.hyoji_TestJumper').hover(function() {
    $('.hyoji_TestJumper-2 img').attr('src', 'images/04_TestJumper_on.png');
  }, function() {
    $('.hyoji_TestJumper-2 img').attr('src', 'images/04_TestJumper_off.png');
  });
});

//-----05-----------------------------------------------------------------
$(function() {
  $('.hyoji_CC-linkInterfaceUnit').hover(function() {
    $('.hyoji_CC-linkInterfaceUnit-2 img').attr('src', 'images/05_CC-linkInterfaceUnit_on.png');
  }, function() {
    $('.hyoji_CC-linkInterfaceUnit-2 img').attr('src', 'images/05_CC-linkInterfaceUnit_off.png');
  });
});
$(function() {
  $('.hyoji_Modbus-RTU-InterfaceUnit').hover(function() {
    $('.hyoji_Modbus-RTU-InterfaceUnit-2 img').attr('src', 'images/05_Modbus-RTU-InterfaceUnit_on.png');
  }, function() {
    $('.hyoji_Modbus-RTU-InterfaceUnit-2 img').attr('src', 'images/05_Modbus-RTU-InterfaceUnit_off.png');
  });
});
$(function() {
  $('.hyoji_Profibus-DP-InterfaceUnit').hover(function() {
    $('.hyoji_Profibus-DP-InterfaceUnit-2 img').attr('src', 'images/05_Profibus-DP-InterfaceUnit_on.png');
  }, function() {
    $('.hyoji_Profibus-DP-InterfaceUnit-2 img').attr('src', 'images/05_Profibus-DP-InterfaceUnit_off.png');
  });
});
$(function() {
  $('.hyoji_IOunit').hover(function() {
    $('.hyoji_IOunit-2 img').attr('src', 'images/05_IOunit_on.png');
  }, function() {
    $('.hyoji_IOunit-2 img').attr('src', 'images/05_IOunit_off.png');
  });
});

//-----06-----------------------------------------------------------------
$(function() {
  $('.hyoji_MotorChargingDevice').hover(function() {
    $('.hyoji_MotorChargingDevice-2 img').attr('src', 'images/06_MotorChargingDevice_on.png');
  }, function() {
    $('.hyoji_MotorChargingDevice-2 img').attr('src', 'images/06_MotorChargingDevice_off.png');
  });
});
$(function() {
  $('.hyoji_ClosingCoil').hover(function() {
    $('.hyoji_ClosingCoil-2 img').attr('src', 'images/06_ClosingCoil_on.png');
  }, function() {
    $('.hyoji_ClosingCoil-2 img').attr('src', 'images/06_ClosingCoil_off.png');
  });
});
$(function() {
  $('.hyoji_ShuntTripDevice').hover(function() {
    $('.hyoji_ShuntTripDevice-2 img').attr('src', 'images/06_ShuntTripDevice_on.png');
  }, function() {
    $('.hyoji_ShuntTripDevice-2 img').attr('src', 'images/06_ShuntTripDevice_off.png');
  });
});
$(function() {
  $('.hyoji_UnderVoltageTripDevice').hover(function() {
    $('.hyoji_UnderVoltageTripDevice-2 img').attr('src', 'images/06_UnderVoltageTripDevice_on.png');
  }, function() {
    $('.hyoji_UnderVoltageTripDevice-2 img').attr('src', 'images/06_UnderVoltageTripDevice_off.png');
  });
});

//-----07-----------------------------------------------------------------
$(function() {
  $('.hyoji_OCRalarm').hover(function() {
    $('.hyoji_OCRalarm-2 img').attr('src', 'images/07_OCRalarm_on.png');
  }, function() {
    $('.hyoji_OCRalarm-2 img').attr('src', 'images/07_OCRalarm_off.png');
  });
});
$(function() {
  $('.hyoji_AuxiliarySwitch').hover(function() {
    $('.hyoji_AuxiliarySwitch-2 img').attr('src', 'images/07_AuxiliarySwitch_on.png');
  }, function() {
    $('.hyoji_AuxiliarySwitch-2 img').attr('src', 'images/07_AuxiliarySwitch_off.png');
  });
});
$(function() {
  $('.hyoji_CellSwitch').hover(function() {
    $('.hyoji_CellSwitch-2 img').attr('src', 'images/07_CellSwitch_on.png');
  }, function() {
    $('.hyoji_CellSwitch-2 img').attr('src', 'images/07_CellSwitch_off.png');
  });
});
$(function() {
  $('.hyoji_ShortingNC-b-Contact').hover(function() {
    $('.hyoji_ShortingNC-b-Contact-2 img').attr('src', 'images/07_ShortingNC-b-Contact_on.png');
  }, function() {
    $('.hyoji_ShortingNC-b-Contact-2 img').attr('src', 'images/07_ShortingNC-b-Contact_off.png');
  });
});

//-----08-----------------------------------------------------------------
$(function() {
  $('.hyoji_InterphaseBarrier').hover(function() {
    $('.hyoji_InterphaseBarrier-2 img').attr('src', 'images/08_InterphaseBarrier_on.png');
  }, function() {
    $('.hyoji_InterphaseBarrier-2 img').attr('src', 'images/08_InterphaseBarrier_off.png');
  });
});
$(function() {
  $('.hyoji_SafetyShutters').hover(function() {
    $('.hyoji_SafetyShutters-2 img').attr('src', 'images/08_SafetyShutters_on.png');
  }, function() {
    $('.hyoji_SafetyShutters-2 img').attr('src', 'images/08_SafetyShutters_off.png');
  });
});
$(function() {
  $('.hyoji_TerminalCover').hover(function() {
    $('.hyoji_TerminalCover-2 img').attr('src', 'images/08_TerminalCover_on.png');
  }, function() {
    $('.hyoji_TerminalCover-2 img').attr('src', 'images/08_TerminalCover_off.png');
  });
});
$(function() {
  $('.hyoji_Mis-insertionPreventer').hover(function() {
    $('.hyoji_Mis-insertionPreventer-2 img').attr('src', 'images/08_Mis-insertionPreventer_on.png');
  }, function() {
    $('.hyoji_Mis-insertionPreventer-2 img').attr('src', 'images/08_Mis-insertionPreventer_off.png');
  });
});

//-----09-----------------------------------------------------------------
$(function() {
  $('.hyoji_DrawoutInterlock').hover(function() {
    $('.hyoji_DrawoutInterlock-2 img').attr('src', 'images/09_DrawoutInterlock_on.png');
  }, function() {
    $('.hyoji_DrawoutInterlock-2 img').attr('src', 'images/09_DrawoutInterlock_off.png');
  });
});
$(function() {
  $('.hyoji_PositionLock').hover(function() {
    $('.hyoji_PositionLock-2 img').attr('src', 'images/09_PositionLock_on.png');
  }, function() {
    $('.hyoji_PositionLock-2 img').attr('src', 'images/09_PositionLock_off.png');
  });
});
$(function() {
  $('.hyoji_PushButtonCover').hover(function() {
    $('.hyoji_PushButtonCover-2 img').attr('src', 'images/09_PushButtonCover_on.png');
  }, function() {
    $('.hyoji_PushButtonCover-2 img').attr('src', 'images/09_PushButtonCover_off.png');
  });
});
$(function() {
  $('.hyoji_CylinderLock').hover(function() {
    $('.hyoji_CylinderLock-2 img').attr('src', 'images/09_CylinderLock_on.png');
  }, function() {
    $('.hyoji_CylinderLock-2 img').attr('src', 'images/09_CylinderLock_off.png');
  });
});
$(function() {
  $('.hyoji_CastelLock').hover(function() {
    $('.hyoji_CastelLock-2 img').attr('src', 'images/09_CastelLock_on.png');
  }, function() {
    $('.hyoji_CastelLock-2 img').attr('src', 'images/09_CastelLock_off.png');
  });
});
$(function() {
  $('.hyoji_DoorInterlock').hover(function() {
    $('.hyoji_DoorInterlock-2 img').attr('src', 'images/09_DoorInterlock_on.png');
  }, function() {
    $('.hyoji_DoorInterlock-2 img').attr('src', 'images/09_DoorInterlock_off.png');
  });
});
$(function() {
  $('.hyoji_MechanicalInterlock').hover(function() {
    $('.hyoji_MechanicalInterlock-2 img').attr('src', 'images/09_MechanicalInterlock_on.png');
  }, function() {
    $('.hyoji_MechanicalInterlock-2 img').attr('src', 'images/09_MechanicalInterlock_off.png');
  });
});

//-----10-----------------------------------------------------------------
$(function() {
  $('.hyoji_DoorFrame').hover(function() {
    $('.hyoji_DoorFrame-2 img').attr('src', 'images/10_DoorFrame_on.png');
  }, function() {
    $('.hyoji_DoorFrame-2 img').attr('src', 'images/10_DoorFrame_off.png');
  });
});
$(function() {
  $('.hyoji_DustCover').hover(function() {
    $('.hyoji_DustCover-2 img').attr('src', 'images/10_DustCover_on.png');
  }, function() {
    $('.hyoji_DustCover-2 img').attr('src', 'images/10_DustCover_off.png');
  });
});
$(function() {
  $('.hyoji_Counter').hover(function() {
    $('.hyoji_Counter-2 img').attr('src', 'images/10_Counter_on.png');
  }, function() {
    $('.hyoji_Counter-2 img').attr('src', 'images/10_Counter_off.png');
  });
});
$(function() {
  $('.hyoji_CondenserTripDevice').hover(function() {
    $('.hyoji_CondenserTripDevice-2 img').attr('src', 'images/10_CondenserTripDevice_on.png');
  }, function() {
    $('.hyoji_CondenserTripDevice-2 img').attr('src', 'images/10_CondenserTripDevice_off.png');
  });
});
$(function() {
  $('.hyoji_LiftingHook').hover(function() {
    $('.hyoji_LiftingHook-2 img').attr('src', 'images/10_LiftingHook_on.png');
  }, function() {
    $('.hyoji_LiftingHook-2 img').attr('src', 'images/10_LiftingHook_off.png');
  });
});
$(function() {
  $('.hyoji_NeutralCT').hover(function() {
    $('.hyoji_NeutralCT-2 img').attr('src', 'images/10_NeutralCT_on.png');
  }, function() {
    $('.hyoji_NeutralCT-2 img').attr('src', 'images/10_NeutralCT_off.png');
  });
});
$(function() {
  $('.hyoji_ZCT-1').hover(function() {
    $('.hyoji_ZCT-1-2 img').attr('src', 'images/10_ZCT-1_on.png');
  }, function() {
    $('.hyoji_ZCT-1-2 img').attr('src', 'images/10_ZCT-1_off.png');
  });
});
$(function() {
  $('.hyoji_ZCT-2').hover(function() {
    $('.hyoji_ZCT-2-2 img').attr('src', 'images/10_ZCT-2_on.png');
  }, function() {
    $('.hyoji_ZCT-2-2 img').attr('src', 'images/10_ZCT-2_off.png');
  });
});


