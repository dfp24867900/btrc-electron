import * as Cesium from 'cesium'
import fireImage from '/images/fire.png'

export function addParticleSystem(
  viewer: Cesium.Viewer,
  model: Cesium.Entity,
  config: {
    translation: { x: number; y: number; z: number }
    options: {
      show?: boolean
      emitter?: Cesium.ParticleEmitter
      emitterModelMatrix?: Cesium.Matrix4
      modelMatrix?: Cesium.Matrix4
      emissionRate?: number
      bursts?: Cesium.ParticleBurst[]
      loop?: boolean
      scale?: number
      startScale?: number
      endScale?: number
      color?: Cesium.Color
      startColor?: Cesium.Color
      endColor?: Cesium.Color
      image?: any
      imageSize?: Cesium.Cartesian2
      minimumImageSize?: Cesium.Cartesian2
      maximumImageSize?: Cesium.Cartesian2
      sizeInMeters?: boolean
      speed?: number
      minimumSpeed?: number
      maximumSpeed?: number
      lifetime?: number
      particleLife?: number
      minimumParticleLife?: number
      maximumParticleLife?: number
      mass?: number
      minimumMass?: number
      maximumMass?: number
    }
  }
) {
  // 粒子方向
  const emitterModelMatrix = new Cesium.Matrix4()
  const translation = new Cesium.Cartesian3()
  let hpr = new Cesium.HeadingPitchRoll()
  let trs = new Cesium.TranslationRotationScale()
  const rotation = new Cesium.Quaternion()
  const computeEmitterModelMatrix = () => {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr)
    trs.translation = Cesium.Cartesian3.fromElements(
      config.translation.x,
      config.translation.y,
      config.translation.z,
      translation
    )
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation)
    return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix)
  }

  const tailFlame: Cesium.ParticleSystem = viewer.scene.primitives.add(
    new Cesium.ParticleSystem({
      show: false,
      image: fireImage, // 图片
      emitterModelMatrix: computeEmitterModelMatrix(),
      ...config.options
    })
  )

  viewer.scene.preUpdate.addEventListener(
    (scene: Cesium.Scene, time: Cesium.JulianDate) => {
      // 粒子系统和模型绑定
      let matrix4 = model.computeModelMatrix(time, new Cesium.Matrix4())
      if (matrix4) {
        return (tailFlame.modelMatrix = matrix4)
      }
    }
  )

  return tailFlame
}
